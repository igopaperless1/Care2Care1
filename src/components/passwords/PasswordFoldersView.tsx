import React, { useState } from "react";
import { INITIAL_FOLDERS } from "./data";
import { Folder, Plus, Search, ChevronRight, MoreVertical, Sparkles, X } from "lucide-react";
import { PasswordFolder } from "./types";

interface PasswordFoldersViewProps {
  onSelectFolder: (folderName: string) => void;
}

export const PasswordFoldersView: React.FC<PasswordFoldersViewProps> = ({
  onSelectFolder,
}) => {
  const [folders, setFolders] = useState<PasswordFolder[]>(INITIAL_FOLDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    if (!newFolderName) return;
    const newF: PasswordFolder = {
      id: "f-" + Date.now(),
      name: newFolderName,
      itemCount: 0,
      color: "#FF5A36",
      icon: "📁",
      sizeMb: "0.1 MB",
    };
    setFolders((prev) => [...prev, newF]);
    setNewFolderName("");
    setIsCreating(false);
  };

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Vault Folders
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Organize logins, cards, and secure files into compartmentalized collections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search folders..."
              className="w-full pl-8 pr-3 py-1.5 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* CREATE FOLDER MODAL/BAR */}
      {isCreating && (
        <div className="bg-[#FFF9F5] border-2 border-[#FF5A36] rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 flex-1">
            <Folder className="w-5 h-5 text-[#FF5A36]" />
            <input
              type="text"
              placeholder="Folder Name (e.g. Taxes & Legal)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-white px-3 py-2 rounded-xl border border-orange-200 text-xs font-bold focus:outline-none"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateFolder}
              className="px-4 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-black cursor-pointer shadow-xs"
            >
              Save
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FOLDERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredFolders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => onSelectFolder(folder.name)}
            className="group bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 hover:border-[#FF5A36] rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                {folder.icon || "📁"}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                  {folder.name}
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {folder.itemCount} items • {folder.sizeMb}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};
