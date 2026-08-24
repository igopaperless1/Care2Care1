import React, { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Compass,
  Zap,
  Layers,
  Heart,
  CheckCircle2
} from "lucide-react";
import {
  BLESSIKAA_LIFE_SECTORS,
  BLESSIKAA_CATEGORIES,
  BlessikaaLifeSector
} from "../../data/blessikaaLifeOperatingSystemData";
import { BlessikaaEcosystemModal } from "./BlessikaaEcosystemModal";

export interface BlessikaaLifeSectorBannerProps {
  /** Optional filter for specific sector IDs (for contextual placement in sub-menus) */
  highlightSectorIds?: string[];
  /** Context name (e.g., "Home", "Track & Vitals", "Plan & Calendar", "Caregiver & Family", "Services & Vault", "Paperless") */
  contextName?: string;
  /** Sub-headline description */
  customSubtitle?: string;
  /** Visual variant: 'hero' for Home top, 'compact' for sub-menus */
  variant?: "hero" | "compact" | "minimal";
  /** Optional callback when user clicks (+) to customize home screen */
  onOpenCustomize?: () => void;
  /** Navigation handlers */
  onNavigateToTab?: (tab: "home" | "track" | "plan" | "care" | "services" | "more") => void;
  onNavigateToCareSubTab?: (subTab: string) => void;
}

export const BlessikaaLifeSectorBanner: React.FC<BlessikaaLifeSectorBannerProps> = ({
  highlightSectorIds,
  contextName = "Everyday Life",
  customSubtitle,
  variant = "hero",
  onOpenCustomize,
  onNavigateToTab,
  onNavigateToCareSubTab
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string | undefined>(undefined);
  const [modalTab, setModalTab] = useState<"sectors" | "transformation" | "big_picture" | "engine">("sectors");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter sectors
  const displayedSectors = useMemo(() => {
    let list = BLESSIKAA_LIFE_SECTORS;
    if (highlightSectorIds && highlightSectorIds.length > 0) {
      const highlighted = list.filter((s) => highlightSectorIds.includes(s.id));
      const rest = list.filter((s) => !highlightSectorIds.includes(s.id));
      list = [...highlighted, ...rest];
    }

    if (activeCategory !== "all") {
      list = list.filter((s) => s.category === activeCategory);
    }
    return list;
  }, [highlightSectorIds, activeCategory]);

  const handleOpenSector = (sector: BlessikaaLifeSector) => {
    setSelectedSectorId(sector.id);
    setModalTab("sectors");
    setIsModalOpen(true);
  };

  const handleOpenQuickBrief = () => {
    setSelectedSectorId(undefined);
    setModalTab("transformation");
    setIsModalOpen(true);
  };

  const handleOpenAllSectors = () => {
    setSelectedSectorId(undefined);
    setModalTab("sectors");
    setIsModalOpen(true);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-2.5 text-left select-none">
      {/* ECOSYSTEM MODAL */}
      <BlessikaaEcosystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSectorId={selectedSectorId}
        initialTab={modalTab}
        onNavigateToTab={onNavigateToTab}
        onNavigateToCareSubTab={onNavigateToCareSubTab}
      />

      {/* TOP CONTAINER CARD */}
      <div
        className={`rounded-3xl border transition-all ${
          variant === "hero"
            ? "bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/20 border-orange-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-5 space-y-3.5"
            : "bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3"
        }`}
      >
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A45] to-[#FB923C] flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>Blessikaa Life Operating System</span>
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-800/40">
                  42 Life Sectors
                </span>
                {contextName !== "Everyday Life" && (
                  <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                    {contextName} Context
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                {customSubtitle ||
                  "How Blessikaa helps every sector of your life & what happens after daily use"}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS & CONTROLS */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            {onOpenCustomize && (
              <button
                type="button"
                onClick={onOpenCustomize}
                className="px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#EA580C] dark:text-orange-300 text-xs font-black transition-all flex items-center gap-1 cursor-pointer border border-orange-300 dark:border-orange-800 shadow-2xs hover:scale-105"
                title="Customize what to show on home screen"
              >
                <span className="text-sm font-black">+</span>
                <span>Customize</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAllSectors}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All (42)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Scroll Navigation Chevrons */}
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL SCROLLING SECTORS MENU */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1"
        >
          {/* (+) Quick Customization Card */}
          {onOpenCustomize && (
            <div
              onClick={onOpenCustomize}
              className="min-w-[170px] max-w-[190px] p-3.5 rounded-2xl border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100/70 hover:border-[#FF6A45] transition-all cursor-pointer flex flex-col justify-between shrink-0 group text-center"
            >
              <div className="space-y-2 my-auto">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6A45] text-white flex items-center justify-center mx-auto text-xl font-black shadow-xs group-hover:scale-110 transition-transform">
                  +
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  Add to Home
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Choose which tools, sectors or widgets appear
                </p>
              </div>
              <div className="pt-2 border-t border-orange-200/60 dark:border-orange-800/40 text-[10px] font-black text-[#FF6A45]">
                Configure →
              </div>
            </div>
          )}
          {displayedSectors.map((sector) => {
            const isHighlighted = highlightSectorIds?.includes(sector.id);
            return (
              <div
                key={sector.id}
                onClick={() => handleOpenSector(sector)}
                className={`min-w-[240px] max-w-[270px] sm:min-w-[260px] sm:max-w-[280px] p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shrink-0 group ${
                  isHighlighted
                    ? "bg-white dark:bg-slate-900 border-orange-400 dark:border-orange-600 shadow-sm ring-1 ring-orange-400/30"
                    : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-lg flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        {sector.icon}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        #{sector.number} • {sector.categoryLabel}
                      </span>
                    </div>
                    {isHighlighted && (
                      <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-1.5 py-0.2 rounded-md">
                        In View
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-[#FF6A45] transition-colors line-clamp-1">
                      {sector.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-0.5 leading-snug">
                      {sector.tagline}
                    </p>
                  </div>
                </div>

                {/* BOTTOM RESULT SNIPPET */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  <span className="text-[#EA580C] dark:text-orange-400 font-black flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Daily Impact</span>
                  </span>
                  <div className="flex items-center gap-0.5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all">
                    <span>Brief</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
