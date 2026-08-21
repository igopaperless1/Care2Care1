import React, { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Star,
  Building2,
  Package,
  ChevronRight
} from "lucide-react";
import { SupplierModel } from "./types";

interface ScreenSuppliersProps {
  suppliers: SupplierModel[];
  onOpenAddModal: (type: string) => void;
  onSelectSupplier?: (supplier: SupplierModel) => void;
}

export const ScreenSuppliers: React.FC<ScreenSuppliersProps> = ({
  suppliers,
  onOpenAddModal,
  onSelectSupplier
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* SEARCH AND ADD BAR (Matching Screenshot Card 10) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers..."
            className="w-full pl-10 pr-4 py-3 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* SUPPLIERS LIST (Matching Screenshot Card 10 Layout) */}
      <div className="space-y-3">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            onClick={() => onSelectSupplier && onSelectSupplier(supplier)}
            className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-[#FF5A36] transition-all cursor-pointer group flex items-center justify-between gap-4"
          >
            {/* Left info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-orange-200 flex items-center justify-center text-[#FF5A36] group-hover:bg-[#FF5A36] group-hover:text-white transition-colors shrink-0">
                <Building2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                  {supplier.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {supplier.location}
                </p>

                <div className="flex items-center gap-1.5 mt-1 text-xs font-bold">
                  <span className="text-amber-500 flex items-center gap-0.5 font-black">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {supplier.rating}
                  </span>
                  <span className="text-slate-400 font-normal">
                    ({supplier.reviewCount})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 text-[11px]">
                    {supplier.categories.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Call & contact action */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${supplier.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                title={`Call ${supplier.name}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* BIG ORANGE BUTTON (Matching Screenshot Card 10) */}
      <button
        onClick={() => onOpenAddModal("supplier")}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add New Supplier</span>
      </button>
    </div>
  );
};
