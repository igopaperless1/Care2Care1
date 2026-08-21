import React, { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  Barcode,
  Edit3,
  Trash2,
  Package,
  Layers,
  ChevronRight
} from "lucide-react";
import { InventoryItemModel, CategoryModel } from "./types";

interface ScreenItemsProps {
  items: InventoryItemModel[];
  categories: CategoryModel[];
  onSelectItem: (item: InventoryItemModel) => void;
  onOpenAddModal: (type: string) => void;
  onDelete?: (id: string) => void;
  onOpenBarcode?: (item: InventoryItemModel) => void;
}

export const ScreenItems: React.FC<ScreenItemsProps> = ({
  items,
  categories,
  onSelectItem,
  onOpenAddModal,
  onDelete,
  onOpenBarcode
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "value">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtering
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode.includes(searchQuery);

      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "stock") {
        return sortOrder === "asc"
          ? a.currentStock - b.currentStock
          : b.currentStock - a.currentStock;
      }
      const valA = a.currentStock * a.sellingPrice;
      const valB = b.currentStock * b.sellingPrice;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

  const toggleSort = (field: "name" | "stock" | "value") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* SEARCH AND FILTER BAR (Matching Screenshot Card 2) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, SKU, barcode..."
            className="w-full pl-10 pr-10 py-3 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="In Stock">🟢 In Stock</option>
              <option value="Low Stock">🟡 Low Stock</option>
              <option value="Out of Stock">🔴 Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Button */}
            <button
              onClick={() => toggleSort("stock")}
              className="px-3 py-2 bg-[#FFF9F5] hover:bg-orange-50 text-slate-700 hover:text-[#FF5A36] border border-orange-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Sort: {sortBy}</span>
            </button>

            {/* Add New Item */}
            <button
              onClick={() => onOpenAddModal("item")}
              className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS LIST (Matching Screenshot Card 2 Layout) */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-orange-200/80 rounded-3xl p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-800">No items match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category or status filters, or add a new stock item to your inventory catalog.
            </p>
            <button
              onClick={() => onOpenAddModal("item")}
              className="px-4 py-2 bg-[#FF5A36] text-white text-xs font-black rounded-2xl"
            >
              + Add First Item
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const totalItemValue = item.currentStock * item.sellingPrice;
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-[#FF5A36] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=200&auto=format&fit=crop&q=80"
                      }
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-orange-200/80 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    {item.status === "Out of Stock" && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                        {item.name}
                      </h3>
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          item.status === "In Stock"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "Low Stock"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-bold text-slate-500">
                      <span>SKU: {item.sku}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.warehouseName}</span>
                    </div>

                    <p className="text-xs font-black text-slate-700 mt-1">
                      {item.currentStock} {item.unit}
                    </p>
                  </div>
                </div>

                {/* Right: Total Value & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-orange-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Total Value
                    </span>
                    <span className="text-base font-black text-[#FF5A36]">
                      NPR {totalItemValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {onOpenBarcode && (
                      <button
                        onClick={() => onOpenBarcode(item)}
                        className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-600 hover:text-[#FF5A36] flex items-center justify-center transition-colors"
                        title="View & Print Barcode / QR"
                      >
                        <Barcode className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onSelectItem(item)}
                      className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-[#FF5A36] text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
