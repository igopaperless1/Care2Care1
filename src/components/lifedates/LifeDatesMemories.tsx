import React, { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  FileText,
  Plus,
  Heart,
  Calendar,
  MapPin,
  ChevronRight,
  Camera,
  Upload,
  X
} from "lucide-react";
import { MemoryItem } from "./types";
import { INITIAL_MEMORIES } from "./data";

interface LifeDatesMemoriesProps {
  onAddMemoryClick?: () => void;
}

export const LifeDatesMemories: React.FC<LifeDatesMemoriesProps> = ({
  onAddMemoryClick
}) => {
  const [activeTab, setActiveTab] = useState<"Photos" | "Videos" | "Notes">("Photos");
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("24 May 2025");
  const [newLocation, setNewLocation] = useState("");
  const [newCaption, setNewCaption] = useState("");

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: MemoryItem = {
      id: "m-" + Date.now(),
      title: newTitle,
      date: newDate,
      type: "photo",
      mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80",
      caption: newCaption,
      location: newLocation,
      likes: 1,
    };

    setMemories((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewCaption("");
    setNewLocation("");
  };

  return (
    <div className="space-y-4">
      {/* FILTER TABS */}
      <div className="flex items-center gap-2">
        {(["Photos", "Videos", "Notes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === tab
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : "bg-[#FFF9F5] hover:bg-[#FFEFE8] text-slate-700 border-orange-200/80"
            }`}
          >
            {tab === "Photos" && <ImageIcon className="w-3.5 h-3.5" />}
            {tab === "Videos" && <Video className="w-3.5 h-3.5" />}
            {tab === "Notes" && <FileText className="w-3.5 h-3.5" />}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* PHOTO GRID GALLERY */}
      {activeTab === "Photos" && (
        <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Featured Gallery
            </h3>
            <span className="text-xs font-bold text-[#FF5A36]">56 Photos</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {memories.slice(0, 3).map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedPhoto(m)}
                className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group shadow-2xs border border-orange-200"
              >
                <img
                  src={m.mediaUrl}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-white text-xs font-black truncate">{m.title}</span>
                </div>
              </div>
            ))}

            {/* +45 More Overlay Box */}
            <div
              onClick={() => setSelectedPhoto(memories[0])}
              className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group shadow-2xs border border-orange-200"
            >
              <img
                src={memories[3]?.mediaUrl || memories[0]?.mediaUrl}
                alt="More photos"
                className="w-full h-full object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-xl font-black">+45</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">More</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMORY TIMELINE */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Memory Timeline
          </h3>
          <span className="text-xs font-bold text-slate-600 bg-orange-100 px-2 py-0.5 rounded-full">
            Anniversary Highlights
          </span>
        </div>

        <div className="space-y-2.5">
          {memories.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedPhoto(m)}
              className="bg-white border border-orange-200/80 hover:border-[#FF5A36] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-black text-[#FF5A36] block">{m.date}</span>
                  <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-[#FF5A36] transition-colors">
                    {m.title}
                  </h4>
                  {m.location && (
                    <p className="text-[11px] font-semibold text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{m.location}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-orange-200">
                  <img
                    src={m.mediaUrl}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MEMORY BUTTON */}
      <button
        onClick={() => {
          if (onAddMemoryClick) onAddMemoryClick();
          else setIsAddModalOpen(true);
        }}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>Add Memory</span>
      </button>

      {/* MODAL: PHOTO PREVIEW */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-3 p-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">{selectedPhoto.title}</h4>
                <p className="text-xs text-slate-500">{selectedPhoto.date}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-4/3 rounded-2xl overflow-hidden border border-orange-100">
              <img
                src={selectedPhoto.mediaUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            {selectedPhoto.caption && (
              <p className="text-xs text-slate-700 bg-[#FFF9F5] p-3 rounded-2xl border border-orange-200/80">
                "{selectedPhoto.caption}"
              </p>
            )}

            <button
              onClick={() => setSelectedPhoto(null)}
              className="w-full py-2.5 rounded-2xl bg-[#FF5A36] text-white text-xs font-black hover:bg-[#EA4C27] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW MEMORY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-black text-slate-900">Add New Memory</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Memory Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 5th Anniversary Sunset Dinner"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Pokhara"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Caption / Story</label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Write a sweet reflection or note..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
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
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
