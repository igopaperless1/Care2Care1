import React, { useState } from "react";
import {
  Gift,
  Heart,
  Image as ImageIcon,
  Mail,
  Sparkles,
  Compass,
  Watch,
  Bookmark,
  ChevronRight,
  Plus,
  ExternalLink,
  CheckCircle2,
  X
} from "lucide-react";
import { GiftIdeaItem } from "./types";
import { INITIAL_GIFT_IDEAS } from "./data";

export const LifeDatesGiftIdeas: React.FC = () => {
  const [filter, setFilter] = useState<"For Both" | "For Him" | "For Her">("For Both");
  const [giftIdeas, setGiftIdeas] = useState<GiftIdeaItem[]>(INITIAL_GIFT_IDEAS);
  const [selectedGift, setSelectedGift] = useState<GiftIdeaItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New gift idea form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<"For Him" | "For Her" | "For Both">("For Both");
  const [newPrice, setNewPrice] = useState<"$" | "$$" | "$$$" | "Free / DIY">("$$");

  const handleToggleBookmark = (id: string) => {
    setGiftIdeas((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isBookmarked: !g.isBookmarked } : g))
    );
  };

  const handleAddGiftIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: GiftIdeaItem = {
      id: "gi-" + Date.now(),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      priceRange: newPrice,
      iconName: "Gift",
      tags: ["Custom", "Thoughtful"],
      isBookmarked: true,
    };

    setGiftIdeas((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  const filteredGifts = giftIdeas.filter((g) => {
    if (filter === "For Both") return true;
    return g.category === filter || g.category === "For Both";
  });

  const getIconForName = (name: string) => {
    switch (name) {
      case "Image":
        return <ImageIcon className="w-5 h-5 text-rose-500" />;
      case "Mail":
        return <Mail className="w-5 h-5 text-amber-600" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-emerald-600" />;
      case "Watch":
        return <Watch className="w-5 h-5 text-blue-600" />;
      default:
        return <Gift className="w-5 h-5 text-[#FF5A36]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* FILTER PILLS */}
      <div className="flex items-center gap-2">
        {(["For Both", "For Him", "For Her"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              filter === tab
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : "bg-[#FFF9F5] hover:bg-[#FFEFE8] text-slate-700 border-orange-200/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GIFT IDEAS LIST */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Curated Recommendations ({filteredGifts.length})
          </h3>
          <span className="text-xs font-bold text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-full">
            Surprise Ready
          </span>
        </div>

        <div className="space-y-2.5">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className="bg-white border border-orange-200/80 hover:border-[#FF5A36] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF9F5] border border-orange-200/60 flex items-center justify-center shrink-0">
                  {getIconForName(gift.iconName)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-[#FF5A36] transition-colors">
                      {gift.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {gift.priceRange}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                    {gift.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(gift.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    gift.isBookmarked ? "text-[#FF5A36]" : "text-slate-300 hover:text-slate-500"
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPLORE MORE IDEAS BUTTON */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>Explore More Ideas / Add Custom</span>
      </button>

      {/* MODAL: GIFT DETAILS */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
                  {getIconForName(selectedGift.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{selectedGift.title}</h3>
                  <span className="text-[11px] font-bold text-[#FF5A36]">{selectedGift.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGift(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-[#FFF9F5] p-3 rounded-2xl border border-orange-200/80">
              {selectedGift.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {selectedGift.tags.map((t) => (
                <span key={t} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-500">
                Budget: <strong className="text-slate-900">{selectedGift.priceRange}</strong>
              </span>
              <button
                onClick={() => setSelectedGift(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] text-white text-xs font-black hover:bg-[#EA4C27] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM GIFT IDEA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Gift Idea</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGiftIdea} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gift Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Handmade Scrapbook with Concert Tickets"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Notes</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Where to buy, custom details, sizes..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="For Both">For Both</option>
                    <option value="For Him">For Him</option>
                    <option value="For Her">For Her</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price Tier</label>
                  <select
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="Free / DIY">Free / DIY</option>
                    <option value="$">$ (Under $25)</option>
                    <option value="$$">$$ ($25 - $100)</option>
                    <option value="$$$">$$$ (Luxury $100+)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
