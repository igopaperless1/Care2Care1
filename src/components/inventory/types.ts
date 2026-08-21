export type InventoryTab =
  | "overview"
  | "items"
  | "item_details"
  | "stock_in"
  | "stock_out"
  | "warehouses"
  | "stock_take"
  | "reports"
  | "alerts"
  | "suppliers"
  | "transfers"
  | "settings"
  | "activity_log";

export interface InventoryItemModel {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  unit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  reorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  warehouseId: string;
  warehouseName: string;
  location: string;
  image?: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supplierId?: string;
  supplierName?: string;
  lastUpdated: string;
  batchNumber?: string;
  expiryDate?: string;
  description?: string;
}

export interface WarehouseModel {
  id: string;
  name: string;
  code: string;
  branch: string;
  location: string;
  manager: string;
  contact: string;
  capacityUsedPercent: number;
  totalSkuCount: number;
  status: "Active" | "Inactive";
  image?: string;
}

export interface SupplierModel {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  paymentTerms: string;
  activeOrdersCount: number;
}

export interface StockInRecord {
  id: string;
  grnNumber: string;
  supplierId: string;
  supplierName: string;
  poNumber: string;
  date: string;
  warehouseId: string;
  warehouseName: string;
  items: {
    itemId: string;
    itemName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    unit: string;
  }[];
  totalAmount: number;
  notes?: string;
  receivedBy: string;
  createdAt: string;
}

export interface StockOutRecord {
  id: string;
  soNumber: string;
  customerOrDept: string;
  issueType: "Sales Order" | "Departmental Dispatch" | "Damage Disposal" | "Return to Vendor";
  date: string;
  warehouseId: string;
  warehouseName: string;
  items: {
    itemId: string;
    itemName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    unit: string;
  }[];
  totalAmount: number;
  notes?: string;
  issuedBy: string;
  createdAt: string;
}

export interface StockTransferRecord {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  date: string;
  items: {
    itemId: string;
    itemName: string;
    sku: string;
    quantity: number;
    unit: string;
  }[];
  status: "In Transit" | "Completed" | "Pending";
  transferredBy: string;
  notes?: string;
}

export interface StockTakeRecord {
  id: string;
  referenceNo: string;
  warehouseId: string;
  warehouseName: string;
  countDate: string;
  totalItems: number;
  countedItems: number;
  pendingItems: number;
  varianceFound: number;
  status: "Completed" | "In Progress";
  auditedBy: string;
  varianceList: {
    itemId: string;
    itemName: string;
    sku: string;
    systemStock: number;
    physicalStock: number;
    variance: number;
    unit: string;
  }[];
}

export interface ActivityLogModel {
  id: string;
  type: "received" | "issued" | "transfer" | "adjustment" | "stock_take" | "created" | "updated";
  title: string;
  referenceNo: string;
  timestamp: string;
  date: string;
  time: string;
  details: string;
  user: string;
  warehouse: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  color: string;
  percentage: number;
}
