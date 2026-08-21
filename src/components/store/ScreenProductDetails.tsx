import React, { useState } from "react";
import {
  FileText,
  Package,
  Layers,
  Search,
  ArrowLeft,
  Edit2,
  MoreVertical,
  QrCode,
  History,
  Copy,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Calendar,
  Building,
  TrendingUp,
  Share2
} from "lucide-react";
import { ProductItem, StoreTab } from "./types";

interface ScreenProductDetailsProps {
  product: ProductItem | null;
  onEditProduct: (product: ProductItem) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenProductDetails: React.FC<ScreenProductDetailsProps> = ({
  product,
  onEditProduct,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "inventory" | "variations" | "seo">("overview");
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-3">
        <Package className="w-12 h-12 mx-auto text-slate-300" />
        <h3 className="text-sm font-bold text-slate-900">No Product Selected</h3>
        <p className="text-xs text-slate-500">Please select a product from your catalog to view complete details.</p>
        <button
          type="button"
          onClick={() => onNavigate("products")}
          className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl text-xs font-bold"
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 1. Header with Back Button */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-600 border border-slate-200 cursor-pointer"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{product.name}</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                {product.status}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              SKU: <strong className="text-slate-700">{product.sku}</strong> • {product.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEditProduct(product)}
            className="px-3.5 py-1.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-orange-100 p-1.5 z-20 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Barcode printed for SKU ${product.sku}`);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-orange-50 rounded-xl text-left text-xs font-bold text-slate-700 flex items-center gap-2"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Print Barcode</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate("stock_in");
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-orange-50 rounded-xl text-left text-xs font-bold text-slate-700 flex items-center gap-2"
                >
                  <History className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stock History</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert("Product duplicated into draft state.");
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-orange-50 rounded-xl text-left text-xs font-bold text-slate-700 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duplicate Product</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="bg-white rounded-3xl p-1.5 border border-orange-100/90 shadow-2xs flex items-center gap-1">
        {[
          { id: "overview", label: "Overview" },
          { id: "inventory", label: "Inventory" },
          { id: "variations", label: "Variations" },
          { id: "seo", label: "SEO & Search" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center ${
              activeSubTab === tab.id
                ? "bg-[#FF5A36] text-white shadow-2xs"
                : "text-slate-600 hover:bg-orange-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Details Content */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
        {/* Hero Card with Image */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border border-orange-200 shrink-0"
          />

          <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#FF5A36] uppercase tracking-wider bg-orange-100/80 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
            <p className="text-xs text-slate-500">{product.tagline || product.description}</p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
              <span className="text-lg font-black text-slate-900">
                NPR {product.sellingPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  NPR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* OVERVIEW SUBTAB */}
        {activeSubTab === "overview" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Attributes</h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Brand</span>
                <div className="text-xs font-bold text-slate-800">{product.brand}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available Stock</span>
                <div className="text-xs font-bold text-slate-800">{product.stock} pcs</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Reorder Level</span>
                <div className="text-xs font-bold text-slate-800">{product.reorderLevel} pcs</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Min. Stock Level</span>
                <div className="text-xs font-bold text-slate-800">{product.minStockLevel} pcs</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Net Weight / Vol</span>
                <div className="text-xs font-bold text-slate-800">{product.weight || "N/A"}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Created On</span>
                <div className="text-xs font-bold text-slate-800">{product.createdAt}</div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-1">
              <span className="text-xs font-bold text-slate-800 block">Product Full Description</span>
              <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}

        {/* INVENTORY SUBTAB */}
        {activeSubTab === "inventory" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Warehouse Allocations</h4>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Main Warehouse (Lazimpat)</span>
                <strong className="text-slate-900">{Math.round(product.stock * 0.8)} pcs</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Pokhara Branch Hub</span>
                <strong className="text-slate-900">{Math.round(product.stock * 0.2)} pcs</strong>
              </div>
            </div>
          </div>
        )}

        {/* VARIATIONS SUBTAB */}
        {activeSubTab === "variations" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Configured Variants</h4>
            {product.variations && product.variations.length > 0 ? (
              product.variations.map((v, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-800">{v.name}</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {v.options.map((opt) => (
                      <span key={opt} className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No variant options configured for this standard SKU.</p>
            )}
          </div>
        )}

        {/* SEO SUBTAB */}
        {activeSubTab === "seo" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Search Engine Optimization</h4>
            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
              <div className="text-xs font-bold text-blue-900">{product.seoTitle || product.name}</div>
              <div className="text-[11px] text-emerald-700">https://healthylife.care2care.np/products/{product.sku.toLowerCase()}</div>
              <div className="text-xs text-slate-600">{product.seoDescription || product.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
