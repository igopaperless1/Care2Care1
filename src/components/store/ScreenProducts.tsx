import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  LayoutGrid,
  List,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { ProductItem, ProductCategory, ProductStatus, StoreTab } from "./types";

interface ScreenProductsProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onOpenAddModal: () => void;
  onEditProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenProducts: React.FC<ScreenProductsProps> = ({
  products,
  onSelectProduct,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const categories = [
    "All Categories",
    "Beverages",
    "Supplements",
    "Skincare",
    "Digital Goods",
    "Wellness Services"
  ];

  const statuses = ["All Status", "In Stock", "Low Stock", "Out of Stock", "Digital", "Service"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" || p.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All Status" || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Low Stock":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "Out of Stock":
        return "bg-red-50 text-red-700 border-red-200";
      case "Digital":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Service":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header & Search Control */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Products Catalog ({products.length})</h3>
              <p className="text-xs text-slate-500">Manage pricing, stocks, categories, and SKU barcodes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-orange-50/60 rounded-xl border border-orange-200">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-[#FF5A36] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-[#FF5A36] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative sm:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, SKU..."
              className="w-full pl-9 pr-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Product Items List / Grid */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-orange-100/90 shadow-2xs divide-y divide-orange-100/70">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <div className="text-xs font-bold">No matching products found</div>
              <p className="text-[11px]">Try modifying your search keywords or filter criteria</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-orange-50/40 px-2 rounded-2xl transition-colors"
              >
                {/* Left: Thumbnail & Info */}
                <div
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  onClick={() => {
                    onSelectProduct(p);
                    onNavigate("product_details");
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-orange-200 shrink-0 group-hover:scale-105 transition-transform"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                      <span
                        className={`px-2 py-0.5 border rounded-full text-[10px] font-bold ${getStatusBadge(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>
                        SKU: <strong className="text-slate-700">{p.sku}</strong>
                      </span>
                      <span>•</span>
                      <span>{p.category}</span>
                      <span>•</span>
                      <span>
                        Stock:{" "}
                        <strong
                          className={
                            p.stock <= p.minStockLevel && p.stock > 0
                              ? "text-amber-600"
                              : p.stock === 0
                              ? "text-red-600"
                              : "text-slate-800"
                          }
                        >
                          {p.type === "Digital" ? "Unlimited" : p.type === "Service" ? "Bookable" : `${p.stock} pcs`}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-100">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-black text-slate-900">
                      NPR {p.sellingPrice.toLocaleString()}
                    </div>
                    {p.originalPrice && p.originalPrice > p.sellingPrice && (
                      <div className="text-[10px] text-slate-400 line-through">
                        NPR {p.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(p);
                        onNavigate("product_details");
                      }}
                      className="p-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditProduct(p)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete product "${p.name}"?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-3 border border-orange-100/90 shadow-2xs space-y-2.5 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div
                className="relative rounded-2xl overflow-hidden h-32 border border-orange-100 cursor-pointer"
                onClick={() => {
                  onSelectProduct(p);
                  onNavigate("product_details");
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 border rounded-full text-[9px] font-bold shadow-2xs ${getStatusBadge(
                    p.status
                  )}`}
                >
                  {p.status}
                </span>
              </div>

              <div
                className="cursor-pointer space-y-0.5"
                onClick={() => {
                  onSelectProduct(p);
                  onNavigate("product_details");
                }}
              >
                <div className="text-[10px] text-slate-400 font-semibold uppercase">{p.sku}</div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                <div className="text-[11px] text-slate-500 font-medium">
                  Stock: <strong className="text-slate-800">{p.stock} pcs</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-orange-100">
                <div className="text-xs font-black text-slate-900">
                  NPR {p.sellingPrice.toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => onEditProduct(p)}
                  className="p-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Bottom Add CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>
    </div>
  );
};
