import React, { useState, useEffect } from "react";
import { X, Edit3, Save, Layers, Tag } from "lucide-react";
import { PaperlessAsset } from "./paperlessTypes";
import { PAPERLESS_CATEGORIES } from "./paperlessCategoriesData";

interface PaperlessEditModalProps {
  asset: PaperlessAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAsset: PaperlessAsset) => void;
  showToast: (msg: string) => void;
}

export const PaperlessEditModal: React.FC<PaperlessEditModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSave,
  showToast
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(PAPERLESS_CATEGORIES[0].name);
  const [subService, setSubService] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setCategory(asset.category);
      setSubService(asset.subService);
      setTagsInput(asset.tags ? asset.tags.join(", ") : "");
      setDescription(asset.description || "");
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const currentCategoryObj =
    PAPERLESS_CATEGORIES.find((c) => c.name === category) || PAPERLESS_CATEGORIES[0];

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const matched = PAPERLESS_CATEGORIES.find((c) => c.name === newCat);
    if (matched && matched.subServices.length > 0) {
      setSubService(matched.subServices[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter a valid file name");
      return;
    }

    const updatedTags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const updated: PaperlessAsset = {
      ...asset,
      name: name.trim(),
      category: category,
      subService: subService,
      tags: updatedTags,
      description: description.trim(),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: "Edited asset details & metadata",
          performedBy: "You",
          timestamp: "Just now"
        },
        ...(asset.activityLog || [])
      ]
    };

    onSave(updated);
    showToast(`Updated "${updated.name}" successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-[#FF5A36] text-white flex items-center justify-center font-bold shadow-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Edit Asset
              </h3>
              <p className="text-[10px] text-slate-400">Update metadata & categories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* File Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              File Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              {PAPERLESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Service Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Sub Service
            </label>
            <select
              value={subService}
              onChange={(e) => setSubService(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              {currentCategoryObj.subServices.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. MRI, Brain, Report"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="MRI scan report for neurological and clinical analysis."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
