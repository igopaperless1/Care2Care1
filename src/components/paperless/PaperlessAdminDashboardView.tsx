import React, { useState } from "react";
import {
  Users,
  Folder,
  HardDrive,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  CreditCard,
  ShoppingBag,
  Plane,
  GraduationCap,
  Scale,
  Calendar,
  Truck,
  Home,
  Shield,
  Heart,
  ChevronRight,
  Download,
  Share2,
  Trash2,
  Eye,
  Edit3,
  Copy,
  Star,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Send,
  UploadCloud,
  Check
} from "lucide-react";
import {
  PAPERLESS_CATEGORIES,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_PAPERLESS_ASSETS
} from "./paperlessCategoriesData";
import { PaperlessMainCategory, PaperlessVerificationRequest, PaperlessAsset } from "./paperlessTypes";

interface PaperlessAdminDashboardViewProps {
  onBackToApp?: () => void;
  showToast: (msg: string) => void;
}

export const PaperlessAdminDashboardView: React.FC<PaperlessAdminDashboardViewProps> = ({
  onBackToApp,
  showToast
}) => {
  const [categories, setCategories] = useState<PaperlessMainCategory[]>(PAPERLESS_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<PaperlessMainCategory>(PAPERLESS_CATEGORIES[2]); // Finance & Banking default
  const [verificationRequests, setVerificationRequests] = useState<PaperlessVerificationRequest[]>(
    INITIAL_VERIFICATION_REQUESTS
  );
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | "payment_receipts" | "identity_documents" | "business_documents" | "other_requests"
  >("all");
  const [recentAssets, setRecentAssets] = useState<PaperlessAsset[]>(INITIAL_PAPERLESS_ASSETS);

  // New Category / SubService state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isAddingSubService, setIsAddingSubService] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssetType, setSelectedAssetType] = useState("all");

  const handleApproveRequest = (reqId: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "approved" as const } : r))
    );
    showToast("Verification request approved successfully!");
  };

  const handleRejectRequest = (reqId: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "rejected" as const } : r))
    );
    showToast("Verification request marked as rejected.");
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: PaperlessMainCategory = {
      id: newCatName.toLowerCase().replace(/\s+/g, "_"),
      name: newCatName.trim(),
      iconName: "Folder",
      color: "from-orange-500 to-[#FF5A36]",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/40",
      totalAssets: 0,
      subServices: [
        { id: "general_docs", name: "General Documents", count: 0 }
      ]
    };
    setCategories([...categories, newCat]);
    setSelectedCategory(newCat);
    setNewCatName("");
    setIsAddingCategory(false);
    showToast(`Added new category: ${newCat.name}`);
  };

  const handleAddNewSubService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const updatedSub = {
      id: newSubName.toLowerCase().replace(/\s+/g, "_"),
      name: newSubName.trim(),
      count: 0
    };
    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          subServices: [...cat.subServices, updatedSub]
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    setSelectedCategory({
      ...selectedCategory,
      subServices: [...selectedCategory.subServices, updatedSub]
    });
    setNewSubName("");
    setIsAddingSubService(false);
    showToast(`Added sub-service: ${updatedSub.name}`);
  };

  const filteredRequests = verificationRequests.filter((r) => {
    if (verificationFilter === "all") return true;
    return r.category === verificationFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
              Care2Care Enterprise Console
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Production
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Paperless Operations & Asset Services
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome back, Roshan Admin! Real-time telemetry, verification queues, and paperless sub-services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>14 May – 20 May 2026</span>
          </div>
          <button
            onClick={() => showToast("Quick actions menu loaded")}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white text-xs font-extrabold shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Actions</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS (Top Row Matching Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 12.5%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold text-slate-400">Total Users</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              24,680
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">from last week</p>
          </div>
        </div>

        {/* Total Assets */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 15.3%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold text-slate-400">Total Assets</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              1,24,850
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">from last week</p>
          </div>
        </div>

        {/* Storage Used */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              25.6%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold text-slate-400">Storage Used</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              256.8 GB
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">of 1 TB Total Quota</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 8
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold text-slate-400">Pending Requests</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              32
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">awaiting approval</p>
          </div>
        </div>

        {/* Verified This Week */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 18.7%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-bold text-slate-400">Verified This Week</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              1,248
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">from last week</p>
          </div>
        </div>
      </div>

      {/* 3-COLUMN MAIN SERVICES & SUB SERVICES MANAGER (Matches design image top right structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COL 1: MAIN SERVICES (CATEGORIES) (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Main Services (Categories)
              </h3>
              <p className="text-[11px] text-slate-400">12 Verified System Divisions</p>
            </div>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs hover:bg-orange-100 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Add Category Input */}
          {isAddingCategory && (
            <form onSubmit={handleAddNewCategory} className="py-3 flex items-center gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-2 py-1.5 text-slate-400 text-xs"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Categories List with Active Indicator */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pt-3 max-h-[380px] pr-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/40 text-slate-900 dark:text-white"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center text-xs font-black shadow-xs`}
                    >
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{cat.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {cat.subServices.length} sub-services • {cat.totalAssets.toLocaleString()} assets
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isSelected ? "text-[#FF5A36]" : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setIsAddingCategory(true)}
            className="w-full mt-3 py-2.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-orange-300 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-orange-500" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* COL 2: SUB SERVICES (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Sub Services ({selectedCategory.name})
              </h3>
              <p className="text-[11px] text-slate-400">Active Document Templates</p>
            </div>
            <button
              onClick={() => setIsAddingSubService(true)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Add SubService Input */}
          {isAddingSubService && (
            <form onSubmit={handleAddNewSubService} className="py-3 flex items-center gap-2">
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Sub-service name..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSubService(false)}
                className="px-2 py-1.5 text-slate-400 text-xs"
              >
                Cancel
              </button>
            </form>
          )}

          <div className="flex-1 overflow-y-auto space-y-2 pt-3 max-h-[380px] pr-1">
            {selectedCategory.subServices.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5A36]"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{sub.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {sub.count?.toLocaleString() || 0} active files
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsAddingSubService(true)}
            className="w-full mt-3 py-2.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-orange-300 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-orange-500" />
            <span>Add Sub Service</span>
          </button>
        </div>

        {/* COL 3: QUICK ACTIONS & FILTER CONSOLE (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-1.5 text-xs font-bold">
              {[
                { label: "Upload Asset", icon: UploadCloud, color: "text-[#FF5A36]" },
                { label: "Create New Asset", icon: FileText, color: "text-blue-500" },
                { label: "Create Category", icon: Folder, color: "text-amber-500" },
                { label: "Bulk Upload (Zip)", icon: HardDrive, color: "text-purple-500" },
                { label: "Import From Cloud", icon: RefreshCw, color: "text-teal-500" },
                { label: "Export System Data", icon: Download, color: "text-emerald-500" },
                { label: "Send Announcement", icon: Send, color: "text-rose-500" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => showToast(`Triggered: ${item.label}`)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Common Action Buttons Reference */}
          <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Common Action Controls
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>View</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Edit</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Share</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFICATION QUEUE & ASSET TELEMETRY (Bottom Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Verification Queue
              </h3>
              <p className="text-[11px] text-slate-400">
                {verificationRequests.filter((r) => r.status === "pending").length} items awaiting compliance review
              </p>
            </div>

            {/* Filter Pills for Verification Queue */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "payment_receipts", label: "Payment (14)" },
                  { id: "identity_documents", label: "Identity (8)" },
                  { id: "business_documents", label: "Business (6)" },
                  { id: "other_requests", label: "Other (4)" }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setVerificationFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
                    verificationFilter === tab.id
                      ? "bg-[#FF5A36] text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Table / Cards */}
          <div className="space-y-2.5 pt-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#FF5A36] flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {req.documentName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      By {req.submittedBy} • {req.date} {req.amount ? `• ${req.amount}` : ""}
                    </p>
                    {req.notes && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                        "{req.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 font-extrabold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  ) : req.status === "approved" ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Verified & Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Types & Storage Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Document Types Split */}
          <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Document Types Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <FileText className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300">PDF</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">68,240</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <FileText className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300">Images</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">32,450</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <FileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">Videos</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">8,210</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileText className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Others</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">15,950</p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Live Activity Feed
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { user: "John Doe", action: "shared 'MRI Report.pdf'", time: "2m ago" },
                { user: "Jane Smith", action: "uploaded 3 new assets", time: "15m ago" },
                { user: "Admin", action: "verified payment receipt", time: "1h ago" },
                { user: "Mike Johnson", action: "requested asset access", time: "2h ago" }
              ].map((act, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0"
                >
                  <p className="text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                    <span className="font-bold">{act.user}</span> {act.action}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
