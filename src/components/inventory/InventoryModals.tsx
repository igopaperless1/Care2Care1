import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Sliders,
  Barcode,
  Building2,
  Printer,
  Camera,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Upload
} from "lucide-react";
import {
  InventoryItemModel,
  WarehouseModel,
  SupplierModel,
  CategoryModel
} from "./types";

interface InventoryModalsProps {
  modalType: string | null;
  activeItem: InventoryItemModel | null;
  categories: CategoryModel[];
  warehouses: WarehouseModel[];
  suppliers: SupplierModel[];
  onClose: () => void;
  onSaveItem: (item: Partial<InventoryItemModel>) => void;
  onAdjustStock: (itemId: string, adjustmentQty: number, reason: string) => void;
  onSaveWarehouse: (warehouse: Partial<WarehouseModel>) => void;
  onSaveSupplier: (supplier: Partial<SupplierModel>) => void;
}

export const InventoryModals: React.FC<InventoryModalsProps> = ({
  modalType,
  activeItem,
  categories,
  warehouses,
  suppliers,
  onClose,
  onSaveItem,
  onAdjustStock,
  onSaveWarehouse,
  onSaveSupplier
}) => {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
        {/* MODAL 1: ADD / EDIT ITEM */}
        {(modalType === "item" || modalType === "edit_item") && (
          <ItemFormModal
            isEdit={modalType === "edit_item"}
            initialItem={activeItem}
            categories={categories}
            warehouses={warehouses}
            suppliers={suppliers}
            onClose={onClose}
            onSave={(data) => {
              onSaveItem(data);
              onClose();
            }}
          />
        )}

        {/* MODAL 2: ADJUST STOCK */}
        {modalType === "adjust_stock" && activeItem && (
          <AdjustStockModal
            item={activeItem}
            onClose={onClose}
            onAdjust={(qty, reason) => {
              onAdjustStock(activeItem.id, qty, reason);
              onClose();
            }}
          />
        )}

        {/* MODAL 3: BARCODE / QR LABEL */}
        {modalType === "barcode" && activeItem && (
          <BarcodeModal item={activeItem} onClose={onClose} />
        )}

        {/* MODAL 4: SCAN BARCODE */}
        {modalType === "scan" && <ScanModal onClose={onClose} />}

        {/* MODAL 5: ADD WAREHOUSE */}
        {modalType === "warehouse" && (
          <WarehouseFormModal
            onClose={onClose}
            onSave={(data) => {
              onSaveWarehouse(data);
              onClose();
            }}
          />
        )}

        {/* MODAL 6: ADD SUPPLIER */}
        {modalType === "supplier" && (
          <SupplierFormModal
            onClose={onClose}
            onSave={(data) => {
              onSaveSupplier(data);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Item Form Submodal
const ItemFormModal: React.FC<{
  isEdit: boolean;
  initialItem: InventoryItemModel | null;
  categories: CategoryModel[];
  warehouses: WarehouseModel[];
  suppliers: SupplierModel[];
  onClose: () => void;
  onSave: (data: Partial<InventoryItemModel>) => void;
}> = ({ isEdit, initialItem, categories, warehouses, suppliers, onClose, onSave }) => {
  const [name, setName] = useState(initialItem?.name || "");
  const [sku, setSku] = useState(initialItem?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState(initialItem?.category || categories[0]?.name || "Raw Materials");
  const [unit, setUnit] = useState(initialItem?.unit || "Pcs");
  const [currentStock, setCurrentStock] = useState(initialItem?.currentStock || 0);
  const [minimumStock, setMinimumStock] = useState(initialItem?.minimumStock || 20);
  const [reorderLevel, setReorderLevel] = useState(initialItem?.reorderLevel || 30);
  const [unitCost, setUnitCost] = useState(initialItem?.unitCost || 100);
  const [sellingPrice, setSellingPrice] = useState(initialItem?.sellingPrice || 150);
  const [warehouseId, setWarehouseId] = useState(initialItem?.warehouseId || warehouses[0]?.id || "");
  const [location, setLocation] = useState(initialItem?.location || "Aisle 1, Rack 2");
  const [supplierId, setSupplierId] = useState(initialItem?.supplierId || suppliers[0]?.id || "");
  const [image, setImage] = useState(
    initialItem?.image ||
      "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=300&auto=format&fit=crop&q=80"
  );
  const [description, setDescription] = useState(initialItem?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.id === warehouseId);
    const sup = suppliers.find((s) => s.id === supplierId);

    onSave({
      id: initialItem?.id,
      name,
      sku,
      category,
      unit,
      currentStock: Number(currentStock),
      reservedStock: initialItem?.reservedStock || 0,
      availableStock: Number(currentStock) - (initialItem?.reservedStock || 0),
      minimumStock: Number(minimumStock),
      reorderLevel: Number(reorderLevel),
      unitCost: Number(unitCost),
      sellingPrice: Number(sellingPrice),
      warehouseId,
      warehouseName: wh?.name || "Main Warehouse",
      location,
      supplierId,
      supplierName: sup?.name || "Default Supplier",
      image,
      description,
      barcode: initialItem?.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      status: Number(currentStock) === 0 ? "Out of Stock" : Number(currentStock) <= Number(minimumStock) ? "Low Stock" : "In Stock",
      lastUpdated: "Just now"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <h3 className="text-base font-black text-slate-900">
          {isEdit ? "Edit Inventory Item" : "+ Add New Inventory Item"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1 sm:col-span-2">
          <label className="font-bold text-slate-700">Item Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">SKU Code *</label>
          <input
            type="text"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-mono font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Unit (Pcs, Kg, Bags) *</label>
          <input
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Current Stock Quantity</label>
          <input
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Unit Cost (NPR)</label>
          <input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Selling Price (NPR)</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Warehouse Location</label>
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold cursor-pointer"
          >
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Bin / Aisle Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFF9F5] border border-orange-200 rounded-xl font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all cursor-pointer"
      >
        {isEdit ? "Update Item" : "Save Item to Inventory"}
      </button>
    </form>
  );
};

// Adjust Stock Modal
const AdjustStockModal: React.FC<{
  item: InventoryItemModel;
  onClose: () => void;
  onAdjust: (qty: number, reason: string) => void;
}> = ({ item, onClose, onAdjust }) => {
  const [newCount, setNewCount] = useState(item.currentStock);
  const [reason, setReason] = useState("Stock Count Reconciliation");

  const diff = newCount - item.currentStock;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <div>
          <h3 className="text-base font-black text-slate-900">Adjust Stock Count</h3>
          <p className="text-xs text-slate-500">{item.name} ({item.sku})</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-500 font-bold">Current System Stock:</span>
          <span className="font-black text-slate-900">{item.currentStock} {item.unit}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-orange-100">
          <span className="text-slate-700 font-bold">New Physical Quantity:</span>
          <input
            type="number"
            value={newCount}
            onChange={(e) => setNewCount(Number(e.target.value))}
            className="w-24 px-3 py-1.5 bg-white border border-orange-200 rounded-xl font-black text-center"
          />
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500 font-bold">Variance Adjustment:</span>
          <span className={`font-black ${diff >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {diff >= 0 ? `+${diff}` : diff} {item.unit}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Reason for Adjustment</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800"
        >
          <option value="Stock Count Reconciliation">Stock Count Reconciliation</option>
          <option value="Damaged / Broken in Transit">Damaged / Broken in Transit</option>
          <option value="Sample / Internal Use">Sample / Internal Use</option>
          <option value="Expired / Write-off">Expired / Write-off</option>
          <option value="Customer Return">Customer Return</option>
        </select>
      </div>

      <button
        onClick={() => onAdjust(diff, reason)}
        className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer"
      >
        Confirm Adjustment
      </button>
    </div>
  );
};

// Barcode & QR Modal
const BarcodeModal: React.FC<{
  item: InventoryItemModel;
  onClose: () => void;
}> = ({ item, onClose }) => {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <h3 className="text-base font-black text-slate-900">Barcode & Label Tag</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 bg-white border-2 border-dashed border-orange-200 rounded-3xl space-y-3 mx-auto max-w-xs shadow-2xs">
        <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
        <p className="text-xs font-bold text-slate-500">SKU: {item.sku} • NPR {item.sellingPrice}</p>

        {/* SVG Generated Simulated Barcode */}
        <div className="py-3 flex flex-col items-center justify-center">
          <svg className="h-16 w-56" viewBox="0 0 200 60">
            <rect x="10" y="5" width="4" height="40" fill="#0F172A" />
            <rect x="18" y="5" width="2" height="40" fill="#0F172A" />
            <rect x="24" y="5" width="6" height="40" fill="#0F172A" />
            <rect x="34" y="5" width="3" height="40" fill="#0F172A" />
            <rect x="42" y="5" width="5" height="40" fill="#0F172A" />
            <rect x="52" y="5" width="2" height="40" fill="#0F172A" />
            <rect x="58" y="5" width="7" height="40" fill="#0F172A" />
            <rect x="70" y="5" width="3" height="40" fill="#0F172A" />
            <rect x="78" y="5" width="4" height="40" fill="#0F172A" />
            <rect x="86" y="5" width="6" height="40" fill="#0F172A" />
            <rect x="96" y="5" width="2" height="40" fill="#0F172A" />
            <rect x="104" y="5" width="5" height="40" fill="#0F172A" />
            <rect x="114" y="5" width="3" height="40" fill="#0F172A" />
            <rect x="122" y="5" width="6" height="40" fill="#0F172A" />
            <rect x="132" y="5" width="4" height="40" fill="#0F172A" />
            <rect x="140" y="5" width="2" height="40" fill="#0F172A" />
            <rect x="146" y="5" width="5" height="40" fill="#0F172A" />
            <rect x="156" y="5" width="3" height="40" fill="#0F172A" />
            <rect x="164" y="5" width="6" height="40" fill="#0F172A" />
            <rect x="174" y="5" width="4" height="40" fill="#0F172A" />
            <rect x="182" y="5" width="2" height="40" fill="#0F172A" />
            <text x="100" y="55" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">
              {item.barcode}
            </text>
          </svg>
        </div>

        <p className="text-[10px] text-slate-400 font-mono">Location: {item.warehouseName} ({item.location})</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            alert("Sent 50 label stickers to thermal label printer (2x1 inch).");
            onClose();
          }}
          className="flex-1 py-3 bg-[#FF5A36] text-white text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Barcode Label</span>
        </button>
      </div>
    </div>
  );
};

// Scan Modal
const ScanModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <h3 className="text-base font-black text-slate-900">Scan Barcode / QR</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-[#FF5A36]">
        <div className="w-48 h-32 border-2 border-dashed border-white rounded-2xl flex items-center justify-center text-white/80 animate-pulse">
          <Scan className="w-12 h-12 text-[#FF5A36]" />
        </div>
        <span className="absolute bottom-3 text-xs font-bold text-white/70 bg-black/40 px-3 py-1 rounded-full">
          Align barcode inside rectangle
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => {
            alert("Scanned SKU: RM-0012 (Steel Rod 12mm) - Found in Main Warehouse");
            onClose();
          }}
          className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-2xl cursor-pointer"
        >
          Simulate Scan (Steel Rod 12mm)
        </button>
      </div>
    </div>
  );
};

// Warehouse Modal
const WarehouseFormModal: React.FC<{
  onClose: () => void;
  onSave: (data: Partial<WarehouseModel>) => void;
}> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Pokhara, Nepal");
  const [branch, setBranch] = useState("Central Hub");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name,
          location,
          branch,
          totalSkuCount: 0,
          capacityUsedPercent: 10,
          status: "Active",
          image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
        });
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <h3 className="text-base font-black text-slate-900">+ Add New Warehouse</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Warehouse Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. West Coast Distribution"
            className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Location Address *</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Branch Name</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer"
      >
        Save Warehouse
      </button>
    </form>
  );
};

// Supplier Form Modal
const SupplierFormModal: React.FC<{
  onClose: () => void;
  onSave: (data: Partial<SupplierModel>) => void;
}> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Pokhara, Nepal");
  const [phone, setPhone] = useState("+977 9801234567");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name,
          location,
          phone,
          rating: 4.8,
          reviewCount: 1,
          categories: ["General Hardware"]
        });
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <h3 className="text-base font-black text-slate-900">+ Add New Supplier</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Supplier Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Industrial Supplies"
            className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Phone Number *</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">City / Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer"
      >
        Save Supplier
      </button>
    </form>
  );
};
