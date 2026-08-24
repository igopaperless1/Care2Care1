import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Shield,
  Layers,
  Zap,
  Globe,
  Award,
  ChevronRight,
  TrendingUp,
  Compass,
  FileText
} from "lucide-react";
import {
  BLESSIKAA_LIFE_SECTORS,
  BLESSIKAA_BIG_PICTURE,
  BLESSIKAA_DAILY_TRANSFORMATION,
  BLESSIKAA_CATEGORIES,
  BlessikaaLifeSector
} from "../../data/blessikaaLifeOperatingSystemData";

interface BlessikaaEcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSectorId?: string;
  initialTab?: "sectors" | "transformation" | "big_picture" | "engine";
  onNavigateToTab?: (tab: "home" | "track" | "plan" | "care" | "services" | "more") => void;
  onNavigateToCareSubTab?: (subTab: string) => void;
}

export const BlessikaaEcosystemModal: React.FC<BlessikaaEcosystemModalProps> = ({
  isOpen,
  onClose,
  initialSectorId,
  initialTab = "sectors",
  onNavigateToTab,
  onNavigateToCareSubTab
}) => {
  const [activeTab, setActiveTab] = useState<"sectors" | "transformation" | "big_picture" | "engine">(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedSectorId, setExpandedSectorId] = useState<string | null>(initialSectorId || null);

  // Sync if initialSectorId changes
  React.useEffect(() => {
    if (initialSectorId) {
      setExpandedSectorId(initialSectorId);
      setActiveTab("sectors");
    }
  }, [initialSectorId]);

  const filteredSectors = useMemo(() => {
    return BLESSIKAA_LIFE_SECTORS.filter((sector) => {
      const matchesCategory = selectedCategory === "all" || sector.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        sector.name.toLowerCase().includes(q) ||
        sector.shortName.toLowerCase().includes(q) ||
        sector.tagline.toLowerCase().includes(q) ||
        sector.what.toLowerCase().includes(q) ||
        sector.whatHappensDaily.toLowerCase().includes(q) ||
        sector.subServices.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleLaunchSector = (sector: BlessikaaLifeSector) => {
    onClose();
    if (sector.targetSubTab && onNavigateToCareSubTab) {
      onNavigateToCareSubTab(sector.targetSubTab);
    } else if (sector.targetTab && onNavigateToTab) {
      onNavigateToTab(sector.targetTab);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl border border-orange-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-left">
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-orange-600 via-[#FF5A36] to-amber-500 text-white p-4 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-2xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/25 px-2.5 py-0.5 rounded-full text-white">
                  Care2Care / Blessikaa
                </span>
                <span className="text-xs font-bold text-orange-100 hidden sm:inline-block">
                  • The Complete Life Operating System
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white mt-0.5">
                How Blessikaa Helps Every Sector of Your Life
              </h2>
              <p className="text-xs sm:text-sm text-orange-100 font-medium line-clamp-1">
                Beyond paperless: Live capture, tracking, smart reminders & daily transformation.
              </p>
            </div>
          </div>

          {/* MAIN MODAL TABS */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: "sectors", label: "42 Life Sectors & How It Works", icon: "🌐", count: "42" },
              { id: "transformation", label: "Daily Transformation (With/Without)", icon: "🌅", count: "Timeline" },
              { id: "big_picture", label: "The Big Picture (8 Dimensions)", icon: "🧠", count: "Outcomes" },
              { id: "engine", label: "Core Life Operating Engine", icon: "⚡", count: "7 Pillars" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "bg-white text-[#EA580C] shadow-md scale-102"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-orange-100 text-orange-800" : "bg-black/20 text-white"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
          {/* TAB 1: 42 LIFE SECTORS EXPLORER */}
          {activeTab === "sectors" && (
            <div className="space-y-5">
              {/* SEARCH & CATEGORY FILTER BAR */}
              <div className="space-y-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search across all 42 life sectors, sub-services, or how Blessikaa helps..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* HORIZONTAL CATEGORY SCROLL */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {BLESSIKAA_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTORS GRID / ACCORDION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSectors.map((sector) => {
                  const isExpanded = expandedSectorId === sector.id;
                  return (
                    <div
                      key={sector.id}
                      className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all overflow-hidden ${
                        isExpanded
                          ? "border-orange-500 shadow-md ring-2 ring-orange-400/20 md:col-span-2"
                          : "border-slate-200/90 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-sm"
                      }`}
                    >
                      {/* CARD HEADER */}
                      <div
                        onClick={() => setExpandedSectorId(isExpanded ? null : sector.id)}
                        className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 text-2xl flex items-center justify-center shadow-2xs shrink-0 border border-orange-200/60 dark:border-slate-700">
                            {sector.icon}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                Sector #{sector.number}
                              </span>
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                                {sector.categoryLabel}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                              {sector.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                              {sector.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline hidden sm:inline-block">
                            {isExpanded ? "Collapse" : "Full Brief"}
                          </span>
                          <div className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 transition-transform ${isExpanded ? "rotate-90 bg-orange-100 text-orange-700" : ""}`}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* EXPANDED DETAILED BRIEFING (MATCHING THE DOCUMENT REFERENCE) */}
                      {isExpanded && (
                        <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5 bg-orange-50/20 dark:bg-slate-950/30">
                          {/* WHAT HAPPENS DAILY (HIGHLIGHT HERO BOX) */}
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 space-y-1.5">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                              <Sparkles className="w-4 h-4" />
                              <span>What Happens In Your Life Daily After Using Blessikaa</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                              {sector.whatHappensDaily}
                            </p>
                          </div>

                          {/* ELABORATED SERVICE BREAKDOWN GRID */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                📌 WHAT IT IS
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {sector.what}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                ⚙️ HOW IT WORKS
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {sector.how}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                🎯 PURPOSE & VALUE
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {sector.purpose}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                👥 WHO USES IT & WHEN
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                <strong className="text-slate-900 dark:text-white">For:</strong> {sector.forWhom} <br />
                                <strong className="text-slate-900 dark:text-white">When:</strong> {sector.when}
                              </p>
                            </div>
                          </div>

                          {/* SUB-SERVICES PILLS */}
                          <div className="space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                              Included Sub-Services & Modules ({sector.subServices.length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {sector.subServices.map((sub, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-extrabold px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 shadow-2xs flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-orange-500" />
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* LAUNCH BUTTON */}
                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => handleLaunchSector(sector)}
                              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF5A36] hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                            >
                              <span>Launch {sector.shortName} in Care2Care</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DAILY TRANSFORMATION (TIMELINE COMPARISON) */}
          {activeTab === "transformation" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF5A36]">
                  The Daily Transformation
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Your Life Without vs. With Care2Care / Blessikaa
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  See how an ordinary day turns from chaotic, forgetful, and stressful into structured, healthy, and effortless.
                </p>
              </div>

              {/* TIMELINE LIST */}
              <div className="space-y-4 max-w-3xl mx-auto">
                {BLESSIKAA_DAILY_TRANSFORMATION.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{step.icon}</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {step.time}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                        Step {idx + 1} of 10
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* WITHOUT */}
                      <div className="p-3.5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 space-y-1">
                        <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-black uppercase text-[10px]">
                          <span>❌ Without Blessikaa</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {step.withoutCare2Care}
                        </p>
                      </div>

                      {/* WITH */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black uppercase text-[10px]">
                          <span>✅ With Blessikaa Operating System</span>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 font-bold">
                          {step.withCare2Care}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THE BIG PICTURE (8 DIMENSIONS) */}
          {activeTab === "big_picture" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF5A36]">
                  The 8 Life Dimensions
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  What Happens When You Use Care2Care Daily
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Care2Care harmonizes all eight vital dimensions of human life into a single calm flow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BLESSIKAA_BIG_PICTURE.map((dim) => (
                  <div
                    key={dim.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${dim.color} text-white text-2xl flex items-center justify-center shadow-md`}>
                        {dim.icon}
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                        {dim.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {dim.outcome}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-black text-[#FF5A36]">
                      <span>Achieved Daily</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CORE LIFE OPERATING ENGINE (7 PILLARS) */}
          {activeTab === "engine" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF5A36]">
                  Beyond Just Paperless
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  The 7 Pillars of Care2Care / Blessikaa Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  How every capture, timestamp, reminder, and alert syncs into your life story.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: "📸",
                    title: "Live Capture & Documentation",
                    desc: "Snap photos, record voice memos, scan physical documents via AI OCR, and digitize cards in real time."
                  },
                  {
                    icon: "📍",
                    title: "Track & Trace",
                    desc: "Monitor everything with single-tap precision: vitals, steps, water, sleep, expenses, shipments & habits."
                  },
                  {
                    icon: "⏰",
                    title: "Time Setup & Smart Reminders",
                    desc: "Schedule anything, customize reminder frequency, setup medication alarms and utility due dates."
                  },
                  {
                    icon: "🔔",
                    title: "Proactive Notifications",
                    desc: "Never miss a deadline, medicine, critical appointment, document renewal, or hydration window."
                  },
                  {
                    icon: "📊",
                    title: "Analytics & Insights",
                    desc: "Understand behavioral patterns, view monthly health charts, expense trends, and life consistency heatmaps."
                  },
                  {
                    icon: "🎯",
                    title: "Discipline & Routine Building",
                    desc: "Transform chaos into structured habits through 21-day quests, daily streaks, reward coins and badges."
                  },
                  {
                    icon: "🔗",
                    title: "Connect Everything",
                    desc: "Link family members, emergency medical QR, legal vaults, and spiritual heritage into one unified story."
                  }
                ].map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xl flex items-center justify-center shrink-0">
                      {pillar.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <span className="text-emerald-500">●</span>
            <span>42 Life Sectors • Active & Connected Across All Tabs</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-2xl hover:opacity-90 transition-all cursor-pointer"
          >
            Close & Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
