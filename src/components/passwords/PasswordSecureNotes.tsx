import React, { useState } from "react";
import { INITIAL_SECURE_NOTES } from "./data";
import { FileText, Plus, Search, Lock, Clock, Trash2, X, Check } from "lucide-react";
import { SecureNoteItem } from "./types";

export const PasswordSecureNotes: React.FC = () => {
  const [notes, setNotes] = useState<SecureNoteItem[]>(INITIAL_SECURE_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<SecureNoteItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleSaveNote = () => {
    if (!newTitle) return;
    const item: SecureNoteItem = {
      id: "sn-" + Date.now(),
      title: newTitle,
      content: newContent,
      lastUpdated: "Just now",
      category: "General",
    };
    setNotes((prev) => [item, ...prev]);
    setNewTitle("");
    setNewContent("");
    setIsCreating(false);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Secure Notes
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            End-to-end encrypted markdown notes, API secrets, and server keys
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* CREATE NEW NOTE MODAL/CARD */}
      {isCreating && (
        <div className="bg-[#FFF9F5] border-2 border-[#FF5A36] rounded-3xl p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Create Encrypted Note</h4>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Note Title (e.g. Wi-Fi & Router Passwords)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white px-3.5 py-2 rounded-xl border border-orange-200 text-xs font-bold focus:outline-none"
          />

          <textarea
            rows={4}
            placeholder="Secure content, recovery seeds, SSH keys..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full bg-white p-3.5 rounded-xl border border-orange-200 text-xs font-mono focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-white text-slate-600 border border-orange-200 text-xs font-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="px-5 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-black cursor-pointer shadow-xs hover:bg-[#EA4C27]"
            >
              Encrypt & Save
            </button>
          </div>
        </div>
      )}

      {/* NOTES LIST */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
            className="group bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 hover:border-[#FF5A36] rounded-3xl p-4 sm:p-5 transition-all cursor-pointer shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-lg shadow-2xs">
                  📝
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                    {note.title}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-orange-400" />
                    Updated {note.lastUpdated}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                Encrypted
              </span>
            </div>

            <p className="text-xs font-mono text-slate-600 bg-white/70 p-3 rounded-2xl border border-orange-100/60 line-clamp-2">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
