import React, { useRef } from "react";
import {
  Users,
  GitBranch,
  Network,
  PieChart,
  Clock,
  BookOpen,
  Award,
  UserCheck,
  HeartHandshake,
  Calendar,
  Flame,
  FileText,
  FileSpreadsheet,
  BarChart3,
  DownloadCloud,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Scroll
} from "lucide-react";
import { FamilyTab } from "./types";

interface FamilyNavScrollProps {
  currentTab: FamilyTab;
  onSelectTab: (tab: FamilyTab) => void;
  totalMembersCount: number;
  upcomingEventsCount: number;
  totalDisciplesCount: number;
}

export const FamilyNavScroll: React.FC<FamilyNavScrollProps> = ({
  currentTab,
  onSelectTab,
  totalMembersCount,
  upcomingEventsCount,
  totalDisciplesCount
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: { id: FamilyTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: "interactive_tree", label: "1. Interactive Tree", icon: <Network className="w-3.5 h-3.5" /> },
    { id: "pedigree", label: "2. Pedigree Lineage", icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: "descendant", label: "3. Descendant Branches", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "fan_chart", label: "4. Radial Fan Chart", icon: <PieChart className="w-3.5 h-3.5" /> },
    { id: "timeline", label: "5. Life Timeline", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "members", label: "6. Members Directory", icon: <Users className="w-3.5 h-3.5" />, badge: totalMembersCount },
    { id: "guru_profile", label: "7. Guru / Guru Mata Profile", icon: <Award className="w-3.5 h-3.5" />, badge: "Vedic" },
    { id: "guru_details", label: "8. Personal & Contact", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "spiritual_details", label: "9. Spiritual & Updesh", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "family_link", label: "10. Family Link (Guru Mata)", icon: <HeartHandshake className="w-3.5 h-3.5" /> },
    { id: "events_rituals", label: "11. Events & Rituals", icon: <Calendar className="w-3.5 h-3.5" />, badge: upcomingEventsCount },
    { id: "janam_tithi", label: "12. Tithi, Punyatithi & Shraddha", icon: <Flame className="w-3.5 h-3.5" /> },
    { id: "disciples", label: "13. Shishya & Disciples", icon: <UserCheck className="w-3.5 h-3.5" />, badge: totalDisciplesCount },
    { id: "fasting", label: "14. Fasting & Observances", icon: <Flame className="w-3.5 h-3.5" /> },
    { id: "documents_media", label: "15. Documents & Media Vault", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "notes_instructions", label: "16. Notes & Special Instructions", icon: <Scroll className="w-3.5 h-3.5" /> },
    { id: "analytics", label: "17. Genealogy Analytics", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "export_sync", label: "18. GEDCOM & Backup", icon: <DownloadCloud className="w-3.5 h-3.5" /> }
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative sticky top-[108px] z-20 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-orange-200/80 py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-1.5">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="hidden sm:flex p-1.5 bg-white hover:bg-orange-50 text-slate-500 hover:text-[#FF5A36] border border-orange-200 rounded-xl transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Nav Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth px-1"
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#FF5A36] text-white shadow-md shadow-orange-500/20 scale-[1.02]"
                    : "bg-white hover:bg-orange-100/70 text-slate-700 border border-orange-200/90"
                }`}
              >
                <span className={isActive ? "text-white" : "text-[#FF5A36]"}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-white text-[#FF5A36]"
                        : "bg-orange-100 text-[#FF5A36] border border-orange-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="hidden sm:flex p-1.5 bg-white hover:bg-orange-50 text-slate-500 hover:text-[#FF5A36] border border-orange-200 rounded-xl transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
