import React from "react";
import {
  Download,
  Share2,
  FolderInput,
  Tag,
  Trash2,
  X,
  CheckSquare,
  Square
} from "lucide-react";

interface PaperlessBulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDownload: () => void;
  onBulkShare: () => void;
  onBulkMove: () => void;
  onBulkTag: () => void;
  onBulkDelete: () => void;
}

export const PaperlessBulkActionsBar: React.FC<PaperlessBulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkDownload,
  onBulkShare,
  onBulkMove,
  onBulkTag,
  onBulkDelete
}) => {
  if (selectedCount === 0) return null;

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900/95 dark:bg-[#0c1322]/95 backdrop-blur-md text-white border border-slate-700/80 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Count & Select All */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-[#FF5A36] text-white font-black text-xs flex items-center justify-center">
              {selectedCount}
            </span>
            <span className="text-xs font-bold text-slate-200">
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </span>
          </div>
          <button
            onClick={onSelectAll}
            className="text-[11px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            onClick={onBulkDownload}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Download Selected"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={onBulkShare}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Share Selected"
          >
            <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={onBulkMove}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Move Category"
          >
            <FolderInput className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Move</span>
          </button>

          <button
            onClick={onBulkTag}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Add Tags"
          >
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Tags</span>
          </button>

          <button
            onClick={onBulkDelete}
            className="px-2.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-xs font-bold text-rose-300 hover:text-rose-100 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-rose-800/40"
            title="Delete Selected"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <button
            onClick={onClearSelection}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
