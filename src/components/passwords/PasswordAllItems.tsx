import React, { useState, useMemo } from "react";
import { Search, Filter, Star, Plus, MoreVertical, ChevronRight, Lock, ExternalLink } from "lucide-react";
import { VaultItem } from "./types";

interface PasswordAllItemsProps {
  items: VaultItem[];
  onSelectItem: (item: VaultItem) => void;
  onToggleFavorite: (id: string) => void;
  onAddNewItem: () => void;
  selectedCategory?: string | null;
}

export const PasswordAllItems: React.FC<PasswordAllItemsProps> = ({
  items,
  onSelectItem,
  onToggleFavorite,
  onAddNewItem,
  selectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "recent">("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.folder.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeFilter === "all"
          ? true
          : activeFilter === "favorites"
          ? item.isFavorite
          : true;

      const matchesCategory = selectedCategory ? item.category === selectedCategory || item.folder === selectedCategory : true;

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [items, searchQuery, activeFilter, selectedCategory]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            All Vault Items
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Zero-knowledge encrypted passwords and credentials
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]"
          />
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-200/60"
          }`}
        >
          All ({items.length})
        </button>

        <button
          onClick={() => setActiveFilter("favorites")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
            activeFilter === "favorites"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-200/60"
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Favorites ({items.filter((i) => i.isFavorite).length})
        </button>

        <button
          onClick={() => setActiveFilter("recent")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "recent"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-200/60"
          }`}
        >
          Recent (10)
        </button>

        <button
          onClick={onAddNewItem}
          className="ml-auto px-3.5 py-1.5 rounded-full bg-orange-100 hover:bg-orange-200 text-[#FF5A36] text-xs font-black flex items-center gap-1 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Item</span>
        </button>
      </div>

      {/* ITEMS LIST */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="group bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 hover:border-[#FF5A36] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-base font-black shadow-xs shrink-0"
                style={{ backgroundColor: item.brandColor || "#FF5A36" }}
              >
                {item.title.charAt(0)}
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors flex items-center gap-2">
                  {item.title}
                  {item.isReused && (
                    <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      Reused
                    </span>
                  )}
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {item.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onToggleFavorite(item.id)}
                className="p-2 rounded-xl hover:bg-orange-100 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                <Star
                  className={`w-4 h-4 ${
                    item.isFavorite ? "fill-amber-400 text-amber-400" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => onSelectItem(item)}
                className="p-2 rounded-xl bg-white group-hover:bg-[#FF5A36] text-slate-400 group-hover:text-white border border-orange-100 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
