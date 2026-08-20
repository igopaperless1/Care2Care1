import React, { useState, useEffect, useMemo } from "react";
import { Patient } from "../types";
import {
  PetNavTab,
  PetProfile,
  PetOverviewMetrics,
  PetHealthRecordItem,
  PetReminderItem,
  PetMealItem,
  PetNutritionSummary,
  PetWalkSession,
  PetBathroomEntry,
  PetGroomingTask,
  PetNoteMediaItem,
  PetProductItem,
  PetCommunityTopic
} from "./pet/types";
import {
  INITIAL_PET_PROFILE,
  INITIAL_OVERVIEW_METRICS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_REMINDERS,
  INITIAL_MEALS,
  INITIAL_NUTRITION_SUMMARY,
  INITIAL_WALK,
  INITIAL_BATHROOM_LOGS,
  INITIAL_GROOMING_TASKS,
  INITIAL_NOTES_MEDIA,
  INITIAL_PRODUCTS,
  INITIAL_COMMUNITY_TOPICS
} from "./pet/mockData";
import {
  PetDashboardScreen,
  PetProfileScreen,
  PetHealthRecordsScreen,
  PetRemindersScreen,
  PetNutritionScreen,
  PetWalkTrackerScreen,
  PetBathroomLogScreen,
  PetGroomingScreen,
  PetInsightsScreen,
  PetNotesMediaScreen,
  PetProductsScreen,
  PetCommunityScreen,
  PetSettingsScreen
} from "./pet/PetScreens";
import {
  LayoutGrid,
  Heart,
  Activity,
  FileText,
  Bell,
  Utensils,
  Flame,
  Compass,
  Scissors,
  TrendingUp,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Settings as SettingsIcon,
  Plus,
  CheckCircle2,
  X,
  Camera,
  Droplet
} from "lucide-react";

export interface PetCareTrackerProps {
  patient?: Patient;
}

export const PetCareTracker: React.FC<PetCareTrackerProps> = ({ patient }) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<PetNavTab>("dashboard");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // State with LocalStorage Persistence
  const [profile, setProfile] = useState<PetProfile>(() => {
    const saved = localStorage.getItem("care2care_pet_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_PET_PROFILE;
  });

  const [metrics, setMetrics] = useState<PetOverviewMetrics>(() => {
    const saved = localStorage.getItem("care2care_pet_metrics");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_OVERVIEW_METRICS;
  });

  const [records, setRecords] = useState<PetHealthRecordItem[]>(() => {
    const saved = localStorage.getItem("care2care_pet_records");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_HEALTH_RECORDS;
  });

  const [reminders, setReminders] = useState<PetReminderItem[]>(() => {
    const saved = localStorage.getItem("care2care_pet_reminders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_REMINDERS;
  });

  const [masterRemindersEnabled, setMasterRemindersEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("care2care_pet_reminders_master");
    return saved !== null ? saved === "true" : true;
  });

  const [meals, setMeals] = useState<PetMealItem[]>(() => {
    const saved = localStorage.getItem("care2care_pet_meals");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_MEALS;
  });

  const [walkSession, setWalkSession] = useState<PetWalkSession>(() => {
    const saved = localStorage.getItem("care2care_pet_walk");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_WALK;
  });

  const [bathroomLogs, setBathroomLogs] = useState<PetBathroomEntry[]>(() => {
    const saved = localStorage.getItem("care2care_pet_bathroom");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BATHROOM_LOGS;
  });

  const [groomingTasks, setGroomingTasks] = useState<PetGroomingTask[]>(() => {
    const saved = localStorage.getItem("care2care_pet_grooming");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_GROOMING_TASKS;
  });

  const [notesMedia, setNotesMedia] = useState<PetNoteMediaItem[]>(() => {
    const saved = localStorage.getItem("care2care_pet_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_NOTES_MEDIA;
  });

  const [products] = useState<PetProductItem[]>(INITIAL_PRODUCTS);
  const [communityTopics] = useState<PetCommunityTopic[]>(INITIAL_COMMUNITY_TOPICS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("care2care_pet_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_metrics", JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_reminders_master", String(masterRemindersEnabled));
  }, [masterRemindersEnabled]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_walk", JSON.stringify(walkSession));
  }, [walkSession]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_bathroom", JSON.stringify(bathroomLogs));
  }, [bathroomLogs]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_grooming", JSON.stringify(groomingTasks));
  }, [groomingTasks]);

  useEffect(() => {
    localStorage.setItem("care2care_pet_notes", JSON.stringify(notesMedia));
  }, [notesMedia]);

  // Modal States
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [isLogMealModalOpen, setIsLogMealModalOpen] = useState(false);
  const [isAddBathroomModalOpen, setIsAddBathroomModalOpen] = useState(false);
  const [isAddGroomingModalOpen, setIsAddGroomingModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<PetProductItem | null>(null);
  const [selectedCommunityModal, setSelectedCommunityModal] = useState<PetCommunityTopic | null>(null);

  // Quick Action Handlers
  const handleQuickWater = () => {
    setMetrics((prev) => ({
      ...prev,
      waterTimesDone: Math.min(prev.waterTimesTotal + 1, prev.waterTimesDone + 1)
    }));
    showToast(`💧 Fresh water logged for ${profile.name}!`);
  };

  const handleToggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleToggleGrooming = (id: string) => {
    setGroomingTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast("Record removed successfully.");
  };

  const handleDeleteBathroomEntry = (id: string) => {
    setBathroomLogs((prev) => prev.filter((b) => b.id !== id));
    showToast("Bathroom entry removed.");
  };

  const handleSaveWalk = (updated: PetWalkSession) => {
    setWalkSession(updated);
    setMetrics((prev) => ({ ...prev, walkMinutes: updated.durationMinutes }));
    showToast(`🦮 Walk session saved (${updated.distanceKm} km, ${updated.durationMinutes} min)!`);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(
      { profile, metrics, records, reminders, meals, walkSession, bathroomLogs, groomingTasks, notesMedia },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name}_PetCare_MedicalPassport.json`;
    a.click();
    showToast("📥 Exported Medical Passport successfully!");
  };

  const handleResetData = () => {
    if (confirm(`Reset ${profile.name}'s profile to default Care2Care settings?`)) {
      setProfile(INITIAL_PET_PROFILE);
      setMetrics(INITIAL_OVERVIEW_METRICS);
      setRecords(INITIAL_HEALTH_RECORDS);
      setReminders(INITIAL_REMINDERS);
      setMeals(INITIAL_MEALS);
      setWalkSession(INITIAL_WALK);
      setBathroomLogs(INITIAL_BATHROOM_LOGS);
      setGroomingTasks(INITIAL_GROOMING_TASKS);
      setNotesMedia(INITIAL_NOTES_MEDIA);
      showToast("🔄 Pet Care profile reset to defaults.");
    }
  };

  // Nav Menu items matching the Care2Care horizontal layout
  const navMenuItems: Array<{ id: PetNavTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "profile", label: "Pet Profile", icon: Heart },
    { id: "health_records", label: "Health Records", icon: FileText },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "nutrition", label: "Nutrition", icon: Utensils },
    { id: "walk_tracker", label: "Walk Tracker", icon: Compass },
    { id: "bathroom_log", label: "Bathroom Log", icon: Droplet },
    { id: "grooming", label: "Grooming", icon: Scissors },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "notes_media", label: "Notes & Media", icon: ImageIcon },
    { id: "products", label: "Products & Care", icon: ShoppingBag },
    { id: "community", label: "Community", icon: Users },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const upcomingVaccine = records.find((r) => r.isUpcoming);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FF5A36] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300 border border-orange-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 TOP HEADER (CARE2CARE CORAL BRANDING) */}
      {/* ============================================================ */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs text-2xl">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Pet Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {profile.name} • {profile.breed}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pet & Vet Care Center
            </h1>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("walk_tracker")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>+ Track Walk</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 🧭 HORIZONTAL SCROLLING MENU (12 SCREENS + SETTINGS) */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-xs font-black scale-[1.02]"
                  : "bg-white text-slate-600 hover:bg-orange-50 hover:text-[#FF5A36] border border-slate-200/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 📱 SCREEN ROUTER */}
      {/* ============================================================ */}
      {activeTab === "dashboard" && (
        <PetDashboardScreen
          profile={profile}
          metrics={metrics}
          upcomingVaccine={upcomingVaccine}
          onNavigate={(tab) => setActiveTab(tab)}
          onQuickWalk={() => setActiveTab("walk_tracker")}
          onQuickMeal={() => setActiveTab("nutrition")}
          onQuickWater={handleQuickWater}
          onQuickBathroom={() => setActiveTab("bathroom_log")}
        />
      )}

      {activeTab === "profile" && (
        <PetProfileScreen
          profile={profile}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          onSwitchPet={() => showToast("Switched to Buddy's active profile")}
        />
      )}

      {activeTab === "health_records" && (
        <PetHealthRecordsScreen
          records={records}
          onAddNewRecord={() => setIsAddRecordModalOpen(true)}
          onDeleteRecord={handleDeleteRecord}
        />
      )}

      {activeTab === "reminders" && (
        <PetRemindersScreen
          reminders={reminders}
          masterEnabled={masterRemindersEnabled}
          onToggleMaster={() => setMasterRemindersEnabled((prev) => !prev)}
          onToggleReminder={handleToggleReminder}
          onAddReminder={() => setIsAddReminderModalOpen(true)}
          onSaveReminderSettings={() => showToast("🔔 Reminder settings saved successfully!")}
        />
      )}

      {activeTab === "nutrition" && (
        <PetNutritionScreen
          meals={meals}
          summary={INITIAL_NUTRITION_SUMMARY}
          onToggleMeal={handleToggleMeal}
          onLogMeal={() => setIsLogMealModalOpen(true)}
        />
      )}

      {activeTab === "walk_tracker" && (
        <PetWalkTrackerScreen walk={walkSession} onSaveWalk={handleSaveWalk} />
      )}

      {activeTab === "bathroom_log" && (
        <PetBathroomLogScreen
          entries={bathroomLogs}
          onAddBathroomEntry={() => setIsAddBathroomModalOpen(true)}
          onDeleteBathroomEntry={handleDeleteBathroomEntry}
        />
      )}

      {activeTab === "grooming" && (
        <PetGroomingScreen
          tasks={groomingTasks}
          onToggleTask={handleToggleGrooming}
          onAddTask={() => setIsAddGroomingModalOpen(true)}
          onSaveGroomingSettings={() => showToast("✂️ Grooming schedule saved successfully!")}
        />
      )}

      {activeTab === "insights" && <PetInsightsScreen />}

      {activeTab === "notes_media" && (
        <PetNotesMediaScreen
          notes={notesMedia}
          onAddNote={() => setIsAddNoteModalOpen(true)}
          onUploadMedia={() => showToast("📸 Photo uploaded to Buddy's media album!")}
        />
      )}

      {activeTab === "products" && (
        <PetProductsScreen
          products={products}
          onSelectProduct={(p) => setSelectedProductModal(p)}
        />
      )}

      {activeTab === "community" && (
        <PetCommunityScreen
          topics={communityTopics}
          onSelectTopic={(t) => setSelectedCommunityModal(t)}
        />
      )}

      {activeTab === "settings" && (
        <PetSettingsScreen
          profile={profile}
          onExportData={handleExportData}
          onResetData={handleResetData}
        />
      )}

      {/* ============================================================ */}
      {/* 🪟 MODALS */}
      {/* ============================================================ */}

      {/* Add Health Record Modal */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Health Record</h3>
              <button
                onClick={() => setIsAddRecordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newRec: PetHealthRecordItem = {
                  id: `rec_${Date.now()}`,
                  title: form.title.value,
                  category: form.category.value,
                  date: form.date.value,
                  dueDateStr: new Date(form.date.value).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  }),
                  isUpcoming: form.isUpcoming.checked,
                  statusText: form.isUpcoming.checked ? "Scheduled" : "Completed"
                };
                setRecords((prev) => [newRec, ...prev]);
                setIsAddRecordModalOpen(false);
                showToast(`💉 Record "${newRec.title}" added successfully!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Record Title / Vaccine</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Bordetella Booster, Blood Panel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Vaccinations">Vaccinations</option>
                    <option value="Checkups">Checkups</option>
                    <option value="Tests">Tests</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" name="isUpcoming" defaultChecked className="accent-[#FF5A36]" />
                <span className="font-bold text-slate-700">This is an upcoming appointment / due date</span>
              </label>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bathroom Log Modal */}
      {isAddBathroomModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Bathroom Log</h3>
              <button
                onClick={() => setIsAddBathroomModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newEntry: PetBathroomEntry = {
                  id: `bath_${Date.now()}`,
                  dateStr: "Today",
                  type: form.type.value,
                  time: form.time.value,
                  status: form.status.value
                };
                setBathroomLogs((prev) => [newEntry, ...prev]);
                setMetrics((prev) => ({ ...prev, bathroomTimes: prev.bathroomTimes + 1 }));
                setIsAddBathroomModalOpen(false);
                showToast(`🚽 ${newEntry.type} entry logged!`);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    name="type"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Poop">💩 Poop</option>
                    <option value="Urine">💧 Urine</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    name="time"
                    defaultValue="8:30 AM"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Condition / Consistency</label>
                <select
                  name="status"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Soft">Soft</option>
                  <option value="Hard">Hard</option>
                  <option value="Diarrhea">Diarrhea</option>
                  <option value="Slight Yellow">Slight Yellow</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBathroomModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Meal Modal */}
      {isLogMealModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Log Meal / Snack</h3>
              <button
                onClick={() => setIsLogMealModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newMeal: PetMealItem = {
                  id: `meal_${Date.now()}`,
                  type: form.type.value,
                  time: form.time.value,
                  description: form.description.value,
                  isCompleted: true
                };
                setMeals((prev) => [...prev, newMeal]);
                setMetrics((prev) => ({ ...prev, foodMealsDone: prev.foodMealsDone + 1 }));
                setIsLogMealModalOpen(false);
                showToast(`🍲 ${newMeal.type} meal logged!`);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meal Type</label>
                  <select
                    name="type"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    name="time"
                    defaultValue="12:30 PM"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Food Items</label>
                <input
                  name="description"
                  required
                  placeholder="e.g. Kibble + Boiled Egg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogMealModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {isAddReminderModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Reminder</h3>
              <button
                onClick={() => setIsAddReminderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newRem: PetReminderItem = {
                  id: `rem_${Date.now()}`,
                  title: form.title.value,
                  scheduleText: form.scheduleText.value,
                  dueInText: form.dueInText.value,
                  enabled: true,
                  categoryIcon: "🔔",
                  category: "General"
                };
                setReminders((prev) => [...prev, newRem]);
                setIsAddReminderModalOpen(false);
                showToast(`🔔 Reminder "${newRem.title}" added!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reminder Name</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Heartworm Pill, Ear Drops"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Schedule</label>
                  <input
                    name="scheduleText"
                    required
                    placeholder="e.g. Every 15 Days"
                    defaultValue="Every Month"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Notice</label>
                  <input
                    name="dueInText"
                    required
                    placeholder="e.g. Due in 5 Days"
                    defaultValue="Due in 7 Days"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddReminderModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Grooming Task Modal */}
      {isAddGroomingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Grooming Task</h3>
              <button
                onClick={() => setIsAddGroomingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newTask: PetGroomingTask = {
                  id: `groom_${Date.now()}`,
                  name: form.name.value,
                  frequencyText: form.frequency.value,
                  dueText: form.dueText.value,
                  enabled: true,
                  isDoneToday: false,
                  icon: "🛁"
                };
                setGroomingTasks((prev) => [...prev, newTask]);
                setIsAddGroomingModalOpen(false);
                showToast(`✂️ Grooming task "${newTask.name}" added!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Paw Balm Treatment, De-shedding"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                  <input
                    name="frequency"
                    required
                    defaultValue="Every 14 Days"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Timing</label>
                  <input
                    name="dueText"
                    required
                    defaultValue="Due in 4 Days"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGroomingModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Pet Note</h3>
              <button
                onClick={() => setIsAddNoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newNote: PetNoteMediaItem = {
                  id: `note_${Date.now()}`,
                  category: form.category.value,
                  title: form.title.value,
                  content: form.content.value,
                  dateStr: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
                  mediaType: "note"
                };
                setNotesMedia((prev) => [newNote, ...prev]);
                setIsAddNoteModalOpen(false);
                showToast(`📝 Note "${newNote.title}" saved!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  name="category"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="Vet Advice">Vet Advice</option>
                  <option value="Allergy Note">Allergy Note</option>
                  <option value="Behavior Note">Behavior Note</option>
                  <option value="General Note">General Note</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Sensitivity to grass pollen"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Details</label>
                <textarea
                  name="content"
                  required
                  rows={3}
                  placeholder="Write observation details, medications, or instructions..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Pet Profile</h3>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                setProfile((prev) => ({
                  ...prev,
                  name: form.name.value,
                  breed: form.breed.value,
                  weight: parseFloat(form.weight.value) || prev.weight,
                  color: form.color.value,
                  microchipId: form.microchipId.value,
                  bloodGroup: form.bloodGroup.value,
                  dietType: form.dietType.value
                }));
                setIsEditProfileModalOpen(false);
                showToast("✨ Pet profile updated successfully!");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pet Name</label>
                <input
                  name="name"
                  defaultValue={profile.name}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Breed</label>
                  <input
                    name="breed"
                    defaultValue={profile.breed}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    defaultValue={profile.weight}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color</label>
                  <input
                    name="color"
                    defaultValue={profile.color}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <input
                    name="bloodGroup"
                    defaultValue={profile.bloodGroup}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Microchip ID</label>
                <input
                  name="microchipId"
                  defaultValue={profile.microchipId}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Diet Type</label>
                <input
                  name="dietType"
                  defaultValue={profile.dietType}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-xl"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{selectedProductModal.icon}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedProductModal.title}</h3>
                  <span className="text-[10px] font-bold text-slate-500">{selectedProductModal.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{selectedProductModal.description}</p>

            <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500">Care2Care Member Price</p>
                <p className="text-base font-black text-slate-900">{selectedProductModal.price || "$24.99"}</p>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                ★ {selectedProductModal.rating}
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedProductModal(null);
                showToast(`🛍️ Added ${selectedProductModal.title} to care basket!`);
              }}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
            >
              Order for {profile.name}
            </button>
          </div>
        </div>
      )}

      {/* Community Interaction Modal */}
      {selectedCommunityModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{selectedCommunityModal.icon}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedCommunityModal.title}</h3>
                  <span className="text-[10px] font-bold text-slate-500">{selectedCommunityModal.memberCount}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCommunityModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{selectedCommunityModal.subtitle}</p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-800">Recent Community Discussion:</p>
              <p className="text-xs text-slate-600 italic">
                "Golden Retriever parents meetup this Saturday 10:00 AM at Sunset Bark Park! Bring water bowls."
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCommunityModal(null);
                showToast(`🎉 Joined "${selectedCommunityModal.title}"!`);
              }}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
            >
              {selectedCommunityModal.actionText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
