import React, { useState } from "react";
import {
  X,
  Package,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  DollarSign,
  Tag,
  Check
} from "lucide-react";
import { ProductItem, ProductCategory, ProductType } from "./types";

interface AddProductModalProps {
  initialProduct?: ProductItem | null;
  onSave: (product: ProductItem) => void;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  initialProduct,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [tagline, setTagline] = useState(initialProduct?.tagline || "");
  const [sku, setSku] = useState(initialProduct?.sku || `PROD-00${Math.floor(10 + Math.random() * 90)}`);
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || "Beverages");
  const [type, setType] = useState<ProductType>(initialProduct?.type || "Physical");
  const [brand, setBrand] = useState(initialProduct?.brand || "Nature's Best");
  const [sellingPrice, setSellingPrice] = useState<number>(initialProduct?.sellingPrice || 450);
  const [originalPrice, setOriginalPrice] = useState<number>(initialProduct?.originalPrice || 550);
  const [stock, setStock] = useState<number>(initialProduct?.stock || 50);
  const [reorderLevel, setReorderLevel] = useState<number>(initialProduct?.reorderLevel || 100);
  const [minStockLevel, setMinStockLevel] = useState<number>(initialProduct?.minStockLevel || 15);
  const [weight, setWeight] = useState(initialProduct?.weight || "250 gm");
  const [description, setDescription] = useState(
    initialProduct?.description || "Premium 100% natural herbal blend harvested from organic farms."
  );
  const [image, setImage] = useState(
    initialProduct?.image ||
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80"
  );

  const sampleImages = [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608248597359-593259837c76?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&auto=format&fit=crop&q=80"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProduct: ProductItem = {
      id: initialProduct?.id || `prod-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      type,
      brand,
      sellingPrice: Number(sellingPrice),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      reorderLevel: Number(reorderLevel),
      minStockLevel: Number(minStockLevel),
      weight,
      description,
      image,
      status: Number(stock) === 0 ? "Out of Stock" : Number(stock) <= Number(minStockLevel) ? "Low Stock" : "In Stock",
      createdAt: initialProduct?.createdAt || new Date().toLocaleDateString()
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full border border-orange-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#FF5A36]" />
            <span>{initialProduct ? "Edit Product" : "Add New Product"}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name & Tagline */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title <span className="text-[#FF5A36]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Green Tea 250g"
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Hand-picked antioxidant rich whole leaves"
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* SKU, Category, Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold uppercase text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="Beverages">Beverages</option>
                <option value="Supplements">Supplements</option>
                <option value="Skincare">Skincare</option>
                <option value="Digital Goods">Digital Goods</option>
                <option value="Wellness Services">Wellness Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="Physical">Physical Good</option>
                <option value="Digital">Digital Good</option>
                <option value="Service">Service Session</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (NPR)</label>
              <input
                type="number"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (NPR)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min. Alert Level</label>
              <input
                type="number"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(Number(e.target.value))}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Image Chooser */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Photo</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {sampleImages.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt="Sample"
                  referrerPolicy="no-referrer"
                  onClick={() => setImage(imgUrl)}
                  className={`w-12 h-12 rounded-xl object-cover border-2 cursor-pointer transition-all ${
                    image === imgUrl ? "border-[#FF5A36] scale-105" : "border-slate-200 opacity-60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Ingredients</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              {initialProduct ? "Update Product" : "Save & Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
