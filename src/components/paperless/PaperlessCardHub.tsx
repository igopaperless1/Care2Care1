import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  FileText,
  ShieldCheck,
  Star,
  Share2,
  Download,
  Trash2,
  Edit3,
  QrCode,
  Camera,
  Folder,
  Layers,
  Sparkles,
  Lock,
  Grid,
  List,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronRight,
  MoreVertical,
  X,
  CreditCard,
  Ticket,
  Award,
  Gift,
  FileCheck,
  Receipt
} from "lucide-react";
import {
  PaperlessAsset,
  PaperlessMainCategory,
  PaperlessSubService,
  PaperlessFilterState,
  PaperlessAssetType
} from "./paperlessTypes";
import {
  PAPERLESS_CATEGORIES,
  INITIAL_PAPERLESS_ASSETS
} from "./paperlessCategoriesData";
import { PaperlessAssetDetailsModal } from "./PaperlessAssetDetailsModal";
import { PaperlessUploadModal } from "./PaperlessUploadModal";
import { PaperlessShareModal } from "./PaperlessShareModal";
import { PaperlessEditModal } from "./PaperlessEditModal";
import { PaperlessBulkActionsBar } from "./PaperlessBulkActionsBar";

interface PaperlessCardHubProps {
  assets: PaperlessAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PaperlessAsset[]>>;
  onOpenInvoicesAndBills?: () => void;
  onOpenScanner?: () => void;
  onOpenVirtualCards?: () => void;
  onOpenContracts?: () => void;
  onOpenTickets?: () => void;
  onOpenQrGenerator?: () => void;
  showToast: (msg: string) => void;
}

export const PaperlessCardHub: React.FC<PaperlessCardHubProps> = ({
  assets,
  setAssets,
  onOpenInvoicesAndBills,
  onOpenScanner,
  onOpenVirtualCards,
  onOpenContracts,
  onOpenTickets,
  onOpenQrGenerator,
  showToast
}) => {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Category & Sub-Service Navigation
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubService, setSelectedSubService] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"all" | "files" | "users">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "size_desc">("newest");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Selection & Bulk Actions
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Modals state
  const [activeAssetDetails, setActiveAssetDetails] = useState<PaperlessAsset | null>(null);
  const [activeShareAsset, setActiveShareAsset] = useState<PaperlessAsset | null>(null);
  const [activeEditAsset, setActiveEditAsset] = useState<PaperlessAsset | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Active Category Object (if specific category selected)
  const currentCategoryObj = useMemo(() => {
    return PAPERLESS_CATEGORIES.find((c) => c.name === selectedCategory || c.id === selectedCategory);
  }, [selectedCategory]);

  // Filtered Assets Computation
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesCategory = asset.category.toLowerCase().includes(q);
        const matchesSub = asset.subService.toLowerCase().includes(q);
        const matchesTags = asset.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesUploader = asset.uploadedBy.name.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesSub && !matchesTags && !matchesUploader) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (asset.category !== selectedCategory && currentCategoryObj?.name !== asset.category) {
          return false;
        }
      }

      // Sub-service filter
      if (selectedSubService !== "all") {
        if (asset.subService !== selectedSubService) {
          return false;
        }
      }

      // File type filter
      if (selectedFileType !== "all") {
        if (asset.fileType !== selectedFileType) {
          return false;
        }
      }

      // Favorites filter
      if (onlyFavorites && !asset.isFavorite) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return b.uploadTimestamp - a.uploadTimestamp;
      if (sortBy === "oldest") return a.uploadTimestamp - b.uploadTimestamp;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "size_desc") return b.fileSizeBytes - a.fileSizeBytes;
      return 0;
    });
  }, [
    assets,
    searchQuery,
    selectedCategory,
    selectedSubService,
    selectedFileType,
    onlyFavorites,
    sortBy,
    currentCategoryObj
  ]);

  // Handlers
  const handleToggleFavorite = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a))
    );
    showToast("Updated favorites");
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    setSelectedAssetIds((prev) => prev.filter((id) => id !== assetId));
    showToast("Asset moved to trash");
  };

  const handleUploadSuccess = (newAsset: PaperlessAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleSaveEditedAsset = (updatedAsset: PaperlessAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));
  };

  const handleShareComplete = (
    assetId: string,
    userShare: { userId: string; name: string; email: string; role: "view" | "edit" | "admin" }
  ) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const existing = a.sharedWith || [];
          return {
            ...a,
            sharedWith: [...existing.filter((s) => s.email !== userShare.email), userShare]
          };
        }
        return a;
      })
    );
  };

  // Selection handlers
  const handleToggleSelectAsset = (assetId: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedAssetIds.length} selected asset(s)?`)) {
      setAssets((prev) => prev.filter((a) => !selectedAssetIds.includes(a.id)));
      setSelectedAssetIds([]);
      showToast("Selected items deleted successfully");
    }
  };

  const handleBulkDownload = () => {
    showToast(`Downloading archive for ${selectedAssetIds.length} files...`);
  };

  const handleBulkShare = () => {
    showToast(`Preparing share link for ${selectedAssetIds.length} assets...`);
  };

  const handleBulkMove = () => {
    const targetCat = prompt("Enter target category name (e.g. Medical & Healthcare, Finance & Banking):");
    if (targetCat) {
      setAssets((prev) =>
        prev.map((a) => (selectedAssetIds.includes(a.id) ? { ...a, category: targetCat } : a))
      );
      setSelectedAssetIds([]);
      showToast(`Moved ${selectedAssetIds.length} items to ${targetCat}`);
    }
  };

  const handleBulkTag = () => {
    const tag = prompt("Enter tag to apply (e.g. 2026, TaxRecord, Urgent):");
    if (tag) {
      const cleanTag = tag.trim().replace(/^#/, "");
      setAssets((prev) =>
        prev.map((a) =>
          selectedAssetIds.includes(a.id)
            ? { ...a, tags: Array.from(new Set([...(a.tags || []), cleanTag])) }
            : a
        )
      );
      setSelectedAssetIds([]);
      showToast(`Applied #${cleanTag} to selected assets`);
    }
  };

  return (
    <div className="space-y-5">
      {/* TOP SCROLLABLE QUICK HUB: TOOL SHORTCUTS & SPECIALIZED CREATORS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory("all");
            setSelectedSubService("all");
            setSelectedFileType("all");
            setOnlyFavorites(false);
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs ${
            selectedCategory === "all" && !onlyFavorites
              ? "bg-[#FF5A36] text-white"
              : "bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-300"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Documents & Assets</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
            {assets.length}
          </span>
        </button>

        {onOpenInvoicesAndBills && (
          <button
            onClick={onOpenInvoicesAndBills}
            className="px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-xs font-black flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>⚡ Invoices, Forms & Bills Studio</span>
          </button>
        )}

        {onOpenVirtualCards && (
          <button
            onClick={onOpenVirtualCards}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 hover:border-orange-300 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>Virtual Cards Studio</span>
          </button>
        )}

        {onOpenContracts && (
          <button
            onClick={onOpenContracts}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 hover:border-blue-300 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <FileCheck className="w-4 h-4 text-blue-500" />
            <span>Contracts & E-Signatures</span>
          </button>
        )}

        {onOpenTickets && (
          <button
            onClick={onOpenTickets}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 hover:border-fuchsia-300 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <Ticket className="w-4 h-4 text-fuchsia-500" />
            <span>Event Passes & Tickets</span>
          </button>
        )}

        {onOpenQrGenerator && (
          <button
            onClick={onOpenQrGenerator}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <QrCode className="w-4 h-4 text-emerald-500" />
            <span>Pro QR Generator</span>
          </button>
        )}

        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 hover:border-cyan-300 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <Camera className="w-4 h-4 text-cyan-500" />
            <span>Camera & OCR Scanner</span>
          </button>
        )}
      </div>

      {/* SEARCH BAR & QUICK CONTROLS (Matches Screen 2 of design) */}
      <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets, documents, medical records, invoices, tags..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Camera Scanner Trigger */}
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-200 hover:text-[#FF5A36] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
              title="Scan with Camera"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
              showFilterPanel || onlyFavorites
                ? "bg-orange-50 dark:bg-orange-950/40 text-[#FF5A36] border-orange-200 dark:border-orange-500/40"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
            }`}
            title="Filter Options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Upload Asset Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white text-xs font-extrabold shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Asset</span>
          </button>
        </div>

        {/* HORIZONTAL SCROLLABLE FILE TYPE PILLS: All, PDF, Image, Doc, Video (Matches Screen 2) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Formats" },
            { id: "pdf", label: "PDF" },
            { id: "image", label: "Image" },
            { id: "doc", label: "Doc" },
            { id: "video", label: "Video" },
            { id: "favorites", label: "Favorites ★" }
          ].map((type) => {
            const isActive =
              type.id === "favorites" ? onlyFavorites : selectedFileType === type.id && !onlyFavorites;
            return (
              <button
                key={type.id}
                onClick={() => {
                  if (type.id === "favorites") {
                    setOnlyFavorites(!onlyFavorites);
                  } else {
                    setOnlyFavorites(false);
                    setSelectedFileType(type.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* EXPANDABLE ADVANCED FILTER PANEL */}
        {showFilterPanel && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
            {/* Category Select */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubService("all");
                }}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs"
              >
                <option value="all">All Categories</option>
                {PAPERLESS_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Service Select */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sub-Service
              </label>
              <select
                value={selectedSubService}
                onChange={(e) => setSelectedSubService(e.target.value)}
                disabled={selectedCategory === "all"}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs disabled:opacity-50"
              >
                <option value="all">All Sub-Services</option>
                {currentCategoryObj?.subServices.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="size_desc">File Size (Largest)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* HORIZONTAL SCROLLABLE CATEGORIES MENU BAR (Matches Screen 1 & Screen 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Paperless Categories
          </span>
          <span className="text-[11px] text-slate-400">
            {PAPERLESS_CATEGORIES.length} Divisions
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSubService("all");
            }}
            className={`px-3 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-300"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All ({assets.length})</span>
          </button>

          {PAPERLESS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubService("all");
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? "bg-[#FF5A36] text-white"
                    : "bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-300"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {cat.subServices.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* SUB-SERVICES PILLS (Visible when a category is selected) */}
        {selectedCategory !== "all" && currentCategoryObj && (
          <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-500/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
            <span className="text-[11px] font-black text-[#FF5A36] uppercase tracking-wider shrink-0 mr-1">
              Sub-Services:
            </span>
            <button
              onClick={() => setSelectedSubService("all")}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubService === "all"
                  ? "bg-[#FF5A36] text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-100"
              }`}
            >
              All
            </button>
            {currentCategoryObj.subServices.map((sub) => {
              const isSubActive = selectedSubService === sub.name;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubService(sub.name)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isSubActive
                      ? "bg-[#FF5A36] text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-100"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ASSETS HEADER & VIEW TOGGLES */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
            {selectedCategory === "all" ? "All Assets" : selectedCategory}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {filteredAssets.length} item{filteredAssets.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Multi-select all toggle */}
          {filteredAssets.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer mr-1"
            >
              {selectedAssetIds.length === filteredAssets.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white dark:bg-[#131d38] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-100 dark:bg-slate-800 text-[#FF5A36]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-slate-100 dark:bg-slate-800 text-[#FF5A36]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ASSETS CARDS CONTAINER (Matches Screens 2, 4, 7 of design) */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A36] dark:bg-orange-950/40 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No paperless assets found
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or upload a new asset into this category.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#FF5A36] text-white font-extrabold text-xs shadow-md hover:opacity-95 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload First Asset</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                className={`group relative bg-white dark:bg-[#131d38] p-4 rounded-3xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isSelected
                    ? "border-[#FF5A36] ring-2 ring-orange-400/30 bg-orange-50/20 dark:bg-orange-950/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-500/30"
                }`}
              >
                {/* Top Row: Checkbox, File Badge & Favorite */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectAsset(asset.id)}
                      className="w-4 h-4 text-orange-500 rounded-md focus:ring-orange-400 cursor-pointer"
                    />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                      {asset.fileType}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(asset.id)}
                      className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          asset.isFavorite ? "text-amber-500 fill-amber-500" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Main Card Clickable Area (Opens Details Modal) */}
                <div
                  onClick={() => setActiveAssetDetails(asset)}
                  className="py-3 flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate group-hover:text-[#FF5A36] transition-colors">
                      {asset.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      {asset.subService || asset.category}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {asset.uploadDate} • {asset.fileSize}
                    </p>
                  </div>
                </div>

                {/* Bottom Tags & Quick Action Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {asset.tags?.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 truncate"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveShareAsset(asset)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF5A36] hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveEditAsset(asset)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveAssetDetails(asset)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-[#131d38] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                  isSelected
                    ? "bg-orange-50/40 dark:bg-orange-950/30"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectAsset(asset.id)}
                    className="w-4 h-4 text-orange-500 rounded-md focus:ring-orange-400 cursor-pointer"
                  />
                  <div
                    onClick={() => setActiveAssetDetails(asset)}
                    className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div
                    onClick={() => setActiveAssetDetails(asset)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {asset.name}
                      </p>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {asset.fileType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {asset.category} • {asset.subService} • {asset.fileSize} • {asset.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleFavorite(asset.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        asset.isFavorite ? "text-amber-500 fill-amber-500" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setActiveShareAsset(asset)}
                    className="p-1.5 text-slate-400 hover:text-[#FF5A36] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveEditAsset(asset)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveAssetDetails(asset)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING ACTION BUTTON (+) FOR QUICK UPLOAD */}
      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-[#FF5A36] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Upload New Asset"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* BULK ACTIONS BAR (When items selected) */}
      <PaperlessBulkActionsBar
        selectedCount={selectedAssetIds.length}
        totalCount={filteredAssets.length}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedAssetIds([])}
        onBulkDownload={handleBulkDownload}
        onBulkShare={handleBulkShare}
        onBulkMove={handleBulkMove}
        onBulkTag={handleBulkTag}
        onBulkDelete={handleBulkDelete}
      />

      {/* ASSET DETAILS MODAL */}
      <PaperlessAssetDetailsModal
        asset={activeAssetDetails}
        isOpen={!!activeAssetDetails}
        onClose={() => setActiveAssetDetails(null)}
        onShare={(ast) => {
          setActiveAssetDetails(null);
          setActiveShareAsset(ast);
        }}
        onEdit={(ast) => {
          setActiveAssetDetails(null);
          setActiveEditAsset(ast);
        }}
        onDelete={handleDeleteAsset}
        onToggleFavorite={handleToggleFavorite}
        showToast={showToast}
      />

      {/* UPLOAD MODAL */}
      <PaperlessUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onOpenScanner={onOpenScanner}
        showToast={showToast}
        initialCategory={selectedCategory !== "all" ? selectedCategory : undefined}
      />

      {/* SHARE MODAL */}
      <PaperlessShareModal
        asset={activeShareAsset}
        isOpen={!!activeShareAsset}
        onClose={() => setActiveShareAsset(null)}
        onShareComplete={handleShareComplete}
        showToast={showToast}
      />

      {/* EDIT MODAL */}
      <PaperlessEditModal
        asset={activeEditAsset}
        isOpen={!!activeEditAsset}
        onClose={() => setActiveEditAsset(null)}
        onSave={handleSaveEditedAsset}
        showToast={showToast}
      />
    </div>
  );
};
