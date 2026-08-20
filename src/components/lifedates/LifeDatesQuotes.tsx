import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  Copy,
  Share2,
  Bookmark,
  CheckCircle2,
  Plus,
  Quote as QuoteIcon,
  X
} from "lucide-react";
import { LifeQuoteItem } from "./types";
import { INITIAL_QUOTES } from "./data";

export const LifeDatesQuotes: React.FC = () => {
  const [filter, setFilter] = useState<"For You" | "Love" | "Motivation" | "Life">("For You");
  const [quotes, setQuotes] = useState<LifeQuoteItem[]>(INITIAL_QUOTES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState<"For You" | "Love" | "Motivation" | "Life">("Love");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q))
    );
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;

    const newItem: LifeQuoteItem = {
      id: "q-" + Date.now(),
      quote: newQuote,
      author: newAuthor || "Anonymous",
      category: newCategory,
      isFavorite: true,
    };

    setQuotes((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewQuote("");
    setNewAuthor("");
  };

  const filteredQuotes = quotes.filter((q) => {
    if (filter === "For You") return true;
    return q.category === filter;
  });

  const featuredQuote = quotes.find((q) => q.id === "q-1") || quotes[0];
  const dailySpecialQuote = quotes.find((q) => q.id === "q-2") || quotes[1];

  return (
    <div className="space-y-4">
      {/* FILTER PILLS */}
      <div className="flex items-center gap-2">
        {(["For You", "Love", "Motivation", "Life"] as const).map((tab) => (
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

      {/* LARGE FEATURED QUOTE CARD */}
      {featuredQuote && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-white to-[#FEEAE0] border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4">
          <div className="text-4xl sm:text-5xl font-serif text-[#FF5A36] leading-none opacity-80">
            “
          </div>

          <p className="text-lg sm:text-xl font-bold text-slate-900 italic max-w-lg mx-auto leading-relaxed">
            {featuredQuote.quote}
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500">{featuredQuote.author}</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleCopy(featuredQuote.id, featuredQuote.quote)}
              className="px-3.5 py-1.5 rounded-2xl bg-white border border-orange-200 text-xs font-bold text-slate-700 hover:bg-orange-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedId === featuredQuote.id ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleToggleFavorite(featuredQuote.id)}
              className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
                featuredQuote.isFavorite
                  ? "bg-rose-100 border-rose-200 text-rose-600"
                  : "bg-white border-orange-200 text-slate-400"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* DAILY SPECIAL QUOTE CARD (24 MAY) */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-[#FF5A36] tracking-wider">
            Daily Quote
          </span>
          <span className="text-xs font-bold text-slate-500">24 May 2025</span>
        </div>

        <p className="text-sm font-black text-slate-800 text-center py-2 leading-relaxed">
          "{dailySpecialQuote.quote}"
        </p>

        <p className="text-xs font-semibold text-slate-500 text-center">
          — {dailySpecialQuote.author}
        </p>
      </div>

      {/* ALL QUOTES LIST */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Curated Expressions ({filteredQuotes.length})
          </h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-black text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Quote</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {filteredQuotes.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-orange-200/70 hover:border-[#FF5A36] rounded-2xl p-4 space-y-2 shadow-2xs transition-all"
            >
              <p className="text-xs font-bold text-slate-800 leading-relaxed italic">
                "{q.quote}"
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="font-semibold text-slate-500">— {q.author}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(q.id, q.quote)}
                    className="text-slate-400 hover:text-[#FF5A36] cursor-pointer p-1"
                    title="Copy text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleFavorite(q.id)}
                    className={`cursor-pointer p-1 ${
                      q.isFavorite ? "text-rose-500" : "text-slate-300 hover:text-rose-400"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD QUOTE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Quote or Vow</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuote} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quote</label>
                <textarea
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="Enter quote or romantic words..."
                  required
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Maya Angelou"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="Love">Love</option>
                    <option value="For You">For You</option>
                    <option value="Motivation">Motivation</option>
                    <option value="Life">Life</option>
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
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
