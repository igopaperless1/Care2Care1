import React, { useState } from "react";
import {
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
} from "./types";
import {
  Heart,
  Activity,
  Calendar,
  Clock,
  Plus,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  Sparkles,
  Shield,
  FileText,
  Trash2,
  Edit2,
  Share2,
  Compass,
  MapPin,
  Flame,
  Droplet,
  Utensils,
  Camera,
  MessageCircle,
  Users,
  Award,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Pill,
  Syringe,
  Info,
  Layers,
  ArrowRight,
  Smile,
  Frown,
  Meh
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

// ============================================================================
// 1. SCREEN: PET DASHBOARD
// ============================================================================
export const PetDashboardScreen: React.FC<{
  profile: PetProfile;
  metrics: PetOverviewMetrics;
  upcomingVaccine: PetHealthRecordItem | undefined;
  onNavigate: (tab: any) => void;
  onQuickWalk: () => void;
  onQuickMeal: () => void;
  onQuickWater: () => void;
  onQuickBathroom: () => void;
}> = ({
  profile,
  metrics,
  upcomingVaccine,
  onNavigate,
  onQuickWalk,
  onQuickMeal,
  onQuickWater,
  onQuickBathroom
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Greeting Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
            Good Morning, Roshan 🐕
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Here's how {profile.name} is doing today.
          </p>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5A36] border border-orange-200/70 flex items-center justify-center font-bold text-lg hover:bg-orange-100 transition-colors cursor-pointer"
        >
          🐾
        </button>
      </div>

      {/* Main Pet Status Card */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-white text-xs p-1 rounded-full shadow-xs border border-orange-200">
              {profile.gender === "Male" ? "♂" : "♀"}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{profile.name}</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {profile.gender === "Male" ? "♂" : "♀"}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600">{profile.breed}</p>
            <p className="text-xs text-slate-500 font-medium">
              {profile.ageYears} Years, {profile.ageMonths} Months
            </p>
            <button
              onClick={() => onNavigate("profile")}
              className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100/90 hover:bg-emerald-200 px-3 py-1 rounded-full border border-emerald-300 transition-colors cursor-pointer mt-1"
            >
              <span>🌱 {profile.healthStatus}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Circular Health Score Ring */}
        <div className="flex items-center gap-3 bg-white/90 p-4 rounded-2xl border border-orange-200/70 shadow-xs shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400">Health Score</p>
            <p className="text-xs font-black text-emerald-600 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Excellent
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-700 text-lg shadow-inner">
            {profile.healthScore}%
          </div>
        </div>
      </div>

      {/* Today's Overview (4 Metric Boxes) */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Today's Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Walk */}
          <div
            onClick={() => onNavigate("walk_tracker")}
            className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              🦮
            </div>
            <p className="text-[10px] font-bold text-slate-500">Walk</p>
            <h4 className="text-base font-black text-slate-900 mt-0.5">{metrics.walkMinutes} min</h4>
          </div>

          {/* Food */}
          <div
            onClick={() => onNavigate("nutrition")}
            className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5A36] flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              🍲
            </div>
            <p className="text-[10px] font-bold text-slate-500">Food</p>
            <h4 className="text-base font-black text-slate-900 mt-0.5">
              {metrics.foodMealsDone}/{metrics.foodMealsTotal} meals
            </h4>
          </div>

          {/* Water */}
          <div
            onClick={onQuickWater}
            className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              💧
            </div>
            <p className="text-[10px] font-bold text-slate-500">Water</p>
            <h4 className="text-base font-black text-slate-900 mt-0.5">
              {metrics.waterTimesDone}/{metrics.waterTimesTotal} times
            </h4>
          </div>

          {/* Bathroom */}
          <div
            onClick={() => onNavigate("bathroom_log")}
            className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-2 group-hover:scale-105 transition-transform">
              💩
            </div>
            <p className="text-[10px] font-bold text-slate-500">Bathroom</p>
            <h4 className="text-base font-black text-slate-900 mt-0.5">{metrics.bathroomTimes} times</h4>
          </div>
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Upcoming</h3>
        {upcomingVaccine ? (
          <div
            onClick={() => onNavigate("health_records")}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl shrink-0">
                🩸
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{upcomingVaccine.title}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  <span className="font-black text-[#FF5A36]">{upcomingVaccine.statusText}</span> • {upcomingVaccine.dueDateStr}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No upcoming vaccinations scheduled.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 2. SCREEN: PET PROFILE
// ============================================================================
export const PetProfileScreen: React.FC<{
  profile: PetProfile;
  onEditProfile: () => void;
  onSwitchPet: () => void;
}> = ({ profile, onEditProfile, onSwitchPet }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Top Profile Card Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-orange-100 shadow-md"
          />
          <button
            onClick={onEditProfile}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-[#E04826] cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
            <button
              onClick={onEditProfile}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-600 mt-0.5">
            {profile.breed} • {profile.gender}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            {profile.ageYears} Years, {profile.ageMonths} Months (Born {profile.dob})
          </p>
        </div>
      </div>

      {/* Profile Details List (Matching Screenshot 2) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Weight */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">⚖️</span>
              <span className="text-xs font-bold text-slate-600">Weight</span>
            </div>
            <span className="text-xs font-black text-slate-900">
              {profile.weight} {profile.weightUnit}
            </span>
          </div>

          {/* Color */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🎨</span>
              <span className="text-xs font-bold text-slate-600">Color</span>
            </div>
            <span className="text-xs font-black text-slate-900">{profile.color}</span>
          </div>

          {/* Microchip ID */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🔢</span>
              <span className="text-xs font-bold text-slate-600">Microchip ID</span>
            </div>
            <span className="text-xs font-black text-slate-900 font-mono">{profile.microchipId}</span>
          </div>

          {/* Spayed / Neutered */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">✂️</span>
              <span className="text-xs font-bold text-slate-600">Spayed / Neutered</span>
            </div>
            <span className="text-xs font-black text-slate-900">
              {profile.isSpayedNeutered ? "Yes" : "No"}
            </span>
          </div>

          {/* Breed */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🐕</span>
              <span className="text-xs font-bold text-slate-600">Breed</span>
            </div>
            <span className="text-xs font-black text-slate-900">{profile.breed}</span>
          </div>

          {/* Blood Group */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🩸</span>
              <span className="text-xs font-bold text-slate-600">Blood Group</span>
            </div>
            <span className="text-xs font-black text-slate-900">{profile.bloodGroup}</span>
          </div>

          {/* Allergies */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌾</span>
              <span className="text-xs font-bold text-slate-600">Allergies</span>
            </div>
            <span className="text-xs font-black text-slate-900">{profile.allergies.join(", ")}</span>
          </div>

          {/* Diet Type */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🍲</span>
              <span className="text-xs font-bold text-slate-600">Diet Type</span>
            </div>
            <span className="text-xs font-black text-slate-900">{profile.dietType}</span>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onEditProfile}
          className="flex-1 py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer text-center"
        >
          Edit Pet Profile
        </button>
        <button
          onClick={onSwitchPet}
          className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center"
        >
          Switch / Add Pet
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 3. SCREEN: HEALTH RECORDS
// ============================================================================
export const PetHealthRecordsScreen: React.FC<{
  records: PetHealthRecordItem[];
  onAddNewRecord: () => void;
  onDeleteRecord: (id: string) => void;
}> = ({ records, onAddNewRecord, onDeleteRecord }) => {
  const [filterCategory, setFilterCategory] = useState<"All" | "Vaccinations" | "Checkups" | "Tests">("All");

  const filteredRecords = records.filter(
    (r) => filterCategory === "All" || r.category === filterCategory
  );

  const upcomingList = filteredRecords.filter((r) => r.isUpcoming);
  const pastList = filteredRecords.filter((r) => !r.isUpcoming);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Filter Tabs (All | Vaccinations | Checkups | Tests) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(["All", "Vaccinations", "Checkups", "Tests"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat
                ? "bg-[#FF5A36] text-white shadow-xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Upcoming Records Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Upcoming</h3>
        {upcomingList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No upcoming records in this category.</p>
        ) : (
          <div className="space-y-2.5">
            {upcomingList.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center text-lg shrink-0">
                    💉
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{rec.dueDateStr}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#FF5A36] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    {rec.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Records Section */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Past Records</h3>
        {pastList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No past completed records logged.</p>
        ) : (
          <div className="space-y-2.5">
            {pastList.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                    📄
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{rec.dueDateStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rec.photoProofUrl && (
                    <img
                      src={rec.photoProofUrl}
                      alt="Proof"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                  )}
                  <button
                    onClick={() => onDeleteRecord(rec.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Record CTA */}
      <button
        onClick={onAddNewRecord}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add New Record</span>
      </button>
    </div>
  );
};

// ============================================================================
// 4. SCREEN: REMINDERS
// ============================================================================
export const PetRemindersScreen: React.FC<{
  reminders: PetReminderItem[];
  masterEnabled: boolean;
  onToggleMaster: () => void;
  onToggleReminder: (id: string) => void;
  onAddReminder: () => void;
  onSaveReminderSettings: () => void;
}> = ({
  reminders,
  masterEnabled,
  onToggleMaster,
  onToggleReminder,
  onAddReminder,
  onSaveReminderSettings
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Master Toggle Bar */}
      <div className="flex items-center justify-between p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-[#FF5A36]" />
          <div>
            <h3 className="text-sm font-black text-slate-900">Pet Reminders</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Receive smart push notifications for Buddy
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={masterEnabled}
            onChange={onToggleMaster}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      {/* Reminder List (Screenshot 4) */}
      <div className="space-y-2.5">
        {reminders.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center text-lg shrink-0">
                {item.categoryIcon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {item.scheduleText} • <span className="font-bold text-slate-700">{item.dueInText}</span>
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={item.enabled && masterEnabled}
                disabled={!masterEnabled}
                onChange={() => onToggleReminder(item.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Add Reminder & Save Settings Actions */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onAddReminder}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Reminder</span>
        </button>

        <button
          onClick={onSaveReminderSettings}
          className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
        >
          Save Reminder Settings
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 5. SCREEN: NUTRITION
// ============================================================================
export const PetNutritionScreen: React.FC<{
  meals: PetMealItem[];
  summary: PetNutritionSummary;
  onToggleMeal: (id: string) => void;
  onLogMeal: () => void;
}> = ({ meals, summary, onToggleMeal, onLogMeal }) => {
  const [nutritionSubTab, setNutritionSubTab] = useState<"Meals" | "Diet Plan" | "Foods">("Meals");

  const pieData = [
    { name: "Protein", value: summary.proteinPercent, color: "#FF5A36" },
    { name: "Carbs", value: summary.carbsPercent, color: "#F59E0B" },
    { name: "Fats", value: summary.fatsPercent, color: "#10B981" },
    { name: "Fiber", value: summary.fiberPercent, color: "#3B82F6" }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Sub Tabs: Meals | Diet Plan | Foods */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl max-w-sm mx-auto">
        {(["Meals", "Diet Plan", "Foods"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setNutritionSubTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              nutritionSubTab === tab
                ? "bg-[#FF5A36] text-white font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {nutritionSubTab === "Meals" && (
        <div className="space-y-6">
          {/* Today's Meals List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Today's Meals</h3>
            <div className="space-y-2.5">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg shrink-0">
                      🥣
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{meal.type}</h4>
                        <span className="text-[10px] text-slate-400 font-bold">{meal.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{meal.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleMeal(meal.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      meal.isCompleted
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "border-2 border-slate-300 text-transparent hover:border-emerald-500"
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onLogMeal}
              className="w-full py-3 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] font-black rounded-2xl text-xs border border-orange-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Meal</span>
            </button>
          </div>

          {/* Nutrition Summary (Donut Chart + Legend) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Nutrition Summary</h3>
              <span className="text-[10px] font-bold text-slate-400">This Week</span>
            </div>

            <div className="bg-[#FFF9F5] p-5 rounded-3xl border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="w-40 h-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5A36]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Protein</p>
                    <p className="text-xs font-black text-slate-900">{summary.proteinPercent}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Carbs</p>
                    <p className="text-xs font-black text-slate-900">{summary.carbsPercent}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Fats</p>
                    <p className="text-xs font-black text-slate-900">{summary.fatsPercent}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Fiber</p>
                    <p className="text-xs font-black text-slate-900">{summary.fiberPercent}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {nutritionSubTab === "Diet Plan" && (
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <h4 className="font-black text-slate-900 mb-1">Golden Retriever Daily Caloric Target</h4>
            <p className="text-slate-600">
              Buddy needs approximately 1,190 kcal/day divided across 2 balanced meals to maintain optimal body weight of 28.5 kg.
            </p>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="font-bold">Morning (8:00 AM)</span>
              <span>1.5 cups High-Protein Kibble + 1 Boiled Egg</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span className="font-bold">Evening (7:00 PM)</span>
              <span>1.5 cups High-Protein Kibble + 1 tbsp Salmon Oil</span>
            </div>
          </div>
        </div>
      )}

      {nutritionSubTab === "Foods" && (
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-900 uppercase">Safe & Toxic Foods for Dogs</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <h5 className="font-black text-emerald-800">✅ Safe Foods</h5>
              <p className="text-emerald-700">Apples (no seeds), Carrots, Boiled Chicken, White Rice, Peanut Butter (xylitol free), Pumpkin.</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
              <h5 className="font-black text-rose-800">❌ Toxic Foods</h5>
              <p className="text-rose-700">Chocolate, Grapes/Raisins, Onions, Garlic, Avocados, Macadamia Nuts, Xylitol sweetener.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. SCREEN: WALK TRACKER
// ============================================================================
export const PetWalkTrackerScreen: React.FC<{
  walk: PetWalkSession;
  onSaveWalk: (walk: PetWalkSession) => void;
}> = ({ walk, onSaveWalk }) => {
  const [selectedMood, setSelectedMood] = useState<PetWalkSession["mood"]>(walk.mood);
  const [notes, setNotes] = useState<string>(walk.notes || "");

  const moodsList: Array<{ label: PetWalkSession["mood"]; emoji: string }> = [
    { label: "Very Bad", emoji: "😡" },
    { label: "Bad", emoji: "🙁" },
    { label: "Okay", emoji: "😐" },
    { label: "Good", emoji: "😊" },
    { label: "Excellent", emoji: "🤩" }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Date Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-xs font-black text-slate-900">{walk.dateStr}</h3>
        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Visual GPS Walk Map Route Graphic */}
      <div className="relative w-full h-44 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner">
        {/* Stylized map grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
        
        {/* SVG Route Line */}
        <svg className="w-full h-full p-6" viewBox="0 0 300 120">
          <path
            d="M 30 90 Q 80 20, 140 70 T 260 30"
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          {/* Start Marker */}
          <circle cx="30" cy="90" r="7" fill="#FF5A36" stroke="#ffffff" strokeWidth="3" />
          {/* Mid Points */}
          <circle cx="140" cy="70" r="5" fill="#10B981" stroke="#ffffff" strokeWidth="2" />
          {/* End Marker */}
          <circle cx="260" cy="30" r="7" fill="#10B981" stroke="#ffffff" strokeWidth="3" />
        </svg>

        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 border border-emerald-200 shadow-xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> GPS Route Active
        </div>
      </div>

      {/* 3 Metric Displays (Duration, Distance, Calories) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/90 text-center">
          <h4 className="text-base sm:text-lg font-black text-slate-900">
            {walk.durationMinutes}:{walk.durationSeconds}
          </h4>
          <p className="text-[10px] font-bold text-slate-500 mt-0.5">Duration</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/90 text-center">
          <h4 className="text-base sm:text-lg font-black text-slate-900">{walk.distanceKm}</h4>
          <p className="text-[10px] font-bold text-slate-500 mt-0.5">km Distance</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/90 text-center">
          <h4 className="text-base sm:text-lg font-black text-slate-900">{walk.caloriesKcal}</h4>
          <p className="text-[10px] font-bold text-slate-500 mt-0.5">kcal Calories</p>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
          Mood During Walk
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodsList.map((m) => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(m.label)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedMood === m.label
                  ? "bg-orange-50 border-[#FF5A36] text-[#FF5A36] scale-105 font-black shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[9px] truncate max-w-full">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
          Notes (Optional)
        </label>
        <input
          type="text"
          placeholder="How was today's walk?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* CTA Button */}
      <button
        onClick={() =>
          onSaveWalk({
            ...walk,
            mood: selectedMood,
            notes
          })
        }
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
      >
        Save Walk
      </button>
    </div>
  );
};

// ============================================================================
// 7. SCREEN: BATHROOM LOG
// ============================================================================
export const PetBathroomLogScreen: React.FC<{
  entries: PetBathroomEntry[];
  onAddBathroomEntry: () => void;
  onDeleteBathroomEntry: (id: string) => void;
}> = ({ entries, onAddBathroomEntry, onDeleteBathroomEntry }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Date Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-xs font-black text-slate-900">14 May 2025</h3>
        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Today's Log List (Screenshot 7) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Today's Log</h3>
        <div className="space-y-2.5">
          {entries.map((item) => {
            const isPoop = item.type === "Poop";
            const icon = isPoop ? "💩" : "💧";
            let badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (item.status === "Soft" || item.status === "Slight Yellow") {
              badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
            } else if (item.status === "Diarrhea" || item.status === "Dark") {
              badgeBg = "bg-rose-50 text-rose-700 border-rose-200";
            }

            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      isPoop ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{item.type}</h4>
                    <p className="text-[11px] text-slate-400 font-bold">{item.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${badgeBg}`}>
                    {item.status}
                  </span>
                  <button
                    onClick={() => onDeleteBathroomEntry(item.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Bathroom Log Action */}
      <button
        onClick={onAddBathroomEntry}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Bathroom Log</span>
      </button>
    </div>
  );
};

// ============================================================================
// 8. SCREEN: GROOMING
// ============================================================================
export const PetGroomingScreen: React.FC<{
  tasks: PetGroomingTask[];
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onSaveGroomingSettings: () => void;
}> = ({ tasks, onToggleTask, onAddTask, onSaveGroomingSettings }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">Grooming Schedule</h2>
        <p className="text-xs text-slate-500 font-medium">Keep Buddy clean, fresh, and well-maintained</p>
      </div>

      {/* Task List (Screenshot 8) */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center text-lg shrink-0">
                {task.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">{task.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {task.frequencyText} • <span className="font-bold text-slate-700">{task.dueText}</span>
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={task.enabled}
                onChange={() => onToggleTask(task.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onAddTask}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Grooming Task</span>
        </button>

        <button
          onClick={onSaveGroomingSettings}
          className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
        >
          Save Grooming Settings
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 9. SCREEN: INSIGHTS
// ============================================================================
export const PetInsightsScreen: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"This Week" | "This Month" | "Last 3 Months">("This Month");

  const activityTrendData = [
    { date: "05 May", distance: 2.2 },
    { date: "08 May", distance: 3.1 },
    { date: "11 May", distance: 2.4 },
    { date: "14 May", distance: 3.8 }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Header & Filter Dropdown */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-900">Pet Insights</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
        >
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Last 3 Months">Last 3 Months</option>
        </select>
      </div>

      {/* 3 Metric Cards: Total Walks, Total Distance, Calories Burned */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#FFF9F5] p-4 rounded-3xl border border-orange-200/80 text-center">
          <p className="text-[10px] font-bold text-slate-500">Total Walks</p>
          <h3 className="text-lg font-black text-slate-900 mt-1">12</h3>
          <p className="text-[10px] text-slate-400 font-medium">Sessions</p>
        </div>

        <div className="bg-[#FFF9F5] p-4 rounded-3xl border border-orange-200/80 text-center">
          <p className="text-[10px] font-bold text-slate-500">Total Distance</p>
          <h3 className="text-lg font-black text-slate-900 mt-1">32.8</h3>
          <p className="text-[10px] text-slate-400 font-medium">km</p>
        </div>

        <div className="bg-[#FFF9F5] p-4 rounded-3xl border border-orange-200/80 text-center">
          <p className="text-[10px] font-bold text-slate-500">Calories Burned</p>
          <h3 className="text-lg font-black text-slate-900 mt-1">1,250</h3>
          <p className="text-[10px] text-slate-400 font-medium">kcal</p>
        </div>
      </div>

      {/* Activity Trend Graph */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Activity Trend</h3>
        <div className="h-44 w-full bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10B981" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bathroom Summary */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Bathroom Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
              💩
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500">Poop</p>
              <h4 className="text-sm font-black text-slate-900">12</h4>
              <span className="text-[10px] font-bold text-emerald-600">Normal</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-lg">
              💧
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500">Urine</p>
              <h4 className="text-sm font-black text-slate-900">13</h4>
              <span className="text-[10px] font-bold text-emerald-600">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 10. SCREEN: NOTES & MEDIA
// ============================================================================
export const PetNotesMediaScreen: React.FC<{
  notes: PetNoteMediaItem[];
  onAddNote: () => void;
  onUploadMedia: () => void;
}> = ({ notes, onAddNote, onUploadMedia }) => {
  const [subTab, setSubTab] = useState<"Notes" | "Photos & Videos">("Notes");

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Sub Tabs: Notes | Photos & Videos */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl max-w-xs mx-auto">
        {(["Notes", "Photos & Videos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              subTab === t
                ? "bg-[#FF5A36] text-white font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === "Notes" ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-orange-300 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {note.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{note.dateStr}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">{note.title}</h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-2">{note.content}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
            </div>
          ))}

          <button
            onClick={onAddNote}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Note</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400"
            ].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Buddy Moment"
                className="w-full h-32 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
            ))}
          </div>

          <button
            onClick={onUploadMedia}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>+ Upload Photo or Video</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 11. SCREEN: PRODUCTS & CARE
// ============================================================================
export const PetProductsScreen: React.FC<{
  products: PetProductItem[];
  onSelectProduct: (product: PetProductItem) => void;
}> = ({ products, onSelectProduct }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">Recommended for Buddy</h2>
        <p className="text-xs text-slate-500 font-medium">Veterinarian approved products tailored for Golden Retrievers</p>
      </div>

      <div className="space-y-2.5">
        {products.map((prod) => (
          <div
            key={prod.id}
            onClick={() => onSelectProduct(prod)}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:border-orange-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A36] flex items-center justify-center text-2xl shrink-0">
                {prod.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">{prod.title}</h4>
                  {prod.badge && (
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">{prod.subtitle}</p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelectProduct(products[0])}
        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-2xl text-xs transition-all cursor-pointer text-center"
      >
        View All Products
      </button>
    </div>
  );
};

// ============================================================================
// 12. SCREEN: COMMUNITY
// ============================================================================
export const PetCommunityScreen: React.FC<{
  topics: PetCommunityTopic[];
  onSelectTopic: (topic: PetCommunityTopic) => void;
}> = ({ topics, onSelectTopic }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">Pet Community</h2>
        <p className="text-xs text-slate-500 font-medium">Join fellow pet parents, ask veterinarians, and find local dog playmates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {topics.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTopic(item)}
            className="p-5 rounded-3xl bg-[#FFF9F5] border border-orange-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF5A36] transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white text-2xl flex items-center justify-center shadow-xs border border-orange-200 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-orange-100">
                {item.memberCount}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{item.subtitle}</p>
            </div>

            <div className="flex items-center text-xs font-black text-[#FF5A36] gap-1">
              <span>{item.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 13. SCREEN: SETTINGS
// ============================================================================
export const PetSettingsScreen: React.FC<{
  profile: PetProfile;
  onExportData: () => void;
  onResetData: () => void;
}> = ({ profile, onExportData, onResetData }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">Pet & Service Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Manage preferences, unit systems, and emergency vet contacts</p>
      </div>

      <div className="space-y-3">
        {/* Unit Preferences */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900">Weight Unit</h4>
            <p className="text-[11px] text-slate-500">Currently set to Kilograms (kg)</p>
          </div>
          <span className="text-xs font-black text-[#FF5A36] bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200">
            kg / km
          </span>
        </div>

        {/* Primary Vet Info */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <h4 className="text-xs font-black text-slate-900">Emergency Vet Contact</h4>
          <p className="text-xs text-slate-700 font-bold">{profile.primaryVet} • {profile.vetClinic}</p>
          <p className="text-xs text-[#FF5A36] font-mono">{profile.vetPhone}</p>
        </div>

        {/* Data Export & Reset */}
        <div className="pt-2 space-y-2">
          <button
            onClick={onExportData}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-2xl text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <span>📥 Export Pet Medical Passport (JSON)</span>
          </button>

          <button
            onClick={onResetData}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-2xl text-xs transition-all cursor-pointer text-center"
          >
            Reset to Default Pet Profile
          </button>
        </div>
      </div>
    </div>
  );
};
