import {
  InventoryItemModel,
  WarehouseModel,
  SupplierModel,
  StockInRecord,
  StockOutRecord,
  StockTransferRecord,
  StockTakeRecord,
  ActivityLogModel,
  CategoryModel
} from "./types";

export const INITIAL_WAREHOUSES: WarehouseModel[] = [
  {
    id: "wh-1",
    name: "Main Warehouse",
    code: "MW-01",
    branch: "Central Warehouse",
    location: "Pokhara, Nepal",
    manager: "Suresh Thapa",
    contact: "+977 9856012345",
    capacityUsedPercent: 78,
    totalSkuCount: 840,
    status: "Active",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "wh-2",
    name: "Secondary Warehouse",
    code: "SW-02",
    branch: "Lakeside Branch",
    location: "Pokhara, Nepal",
    manager: "Anju Gurung",
    contact: "+977 9856098765",
    capacityUsedPercent: 62,
    totalSkuCount: 280,
    status: "Active",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "wh-3",
    name: "Raw Material Store",
    code: "RMS-03",
    branch: "Industrial Area",
    location: "Pokhara, Nepal",
    manager: "Bikram Karki",
    contact: "+977 9846055443",
    capacityUsedPercent: 88,
    totalSkuCount: 95,
    status: "Active",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "wh-4",
    name: "Finished Goods Store",
    code: "FGS-04",
    branch: "Warehouse 4",
    location: "Pokhara, Nepal",
    manager: "Pooja Shrestha",
    contact: "+977 9801234567",
    capacityUsedPercent: 45,
    totalSkuCount: 130,
    status: "Active",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=300&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_ITEMS: InventoryItemModel[] = [
  {
    id: "item-1",
    name: "Steel Rod 12mm",
    sku: "RM-0012",
    barcode: "8901234567890",
    category: "Raw Materials",
    unit: "Pieces",
    currentStock: 850,
    reservedStock: 50,
    availableStock: 800,
    minimumStock: 200,
    reorderLevel: 250,
    unitCost: 150,
    sellingPrice: 200,
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    location: "Aisle 3, Shelf 2",
    status: "In Stock",
    supplierId: "sup-2",
    supplierName: "Nepal Steel Industries",
    lastUpdated: "15 May 2025, 10:20 AM",
    batchNumber: "BAT-ST-2025-05",
    description: "High tensile thermo-mechanically treated reinforcement steel bar.",
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-2",
    name: "Cement OPC 43",
    sku: "RM-0021",
    barcode: "8901234567891",
    category: "Raw Materials",
    unit: "Bags (50kg)",
    currentStock: 120,
    reservedStock: 20,
    availableStock: 100,
    minimumStock: 40,
    reorderLevel: 60,
    unitCost: 600,
    sellingPrice: 720,
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    location: "Bay 1, Pallet 4",
    status: "In Stock",
    supplierId: "sup-3",
    supplierName: "Shree Cement Pvt. Ltd.",
    lastUpdated: "15 May 2025, 08:30 AM",
    batchNumber: "CEM-OPC-889",
    description: "Ordinary Portland Cement Grade 43 for civil construction and plastering.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-3",
    name: "Paint Bucket 20L",
    sku: "PG-0033",
    barcode: "8901234567892",
    category: "Finished Goods",
    unit: "Buckets",
    currentStock: 15,
    reservedStock: 2,
    availableStock: 13,
    minimumStock: 20,
    reorderLevel: 25,
    unitCost: 600,
    sellingPrice: 850,
    warehouseId: "wh-2",
    warehouseName: "Secondary Warehouse",
    location: "Section B, Rack 1",
    status: "Low Stock",
    supplierId: "sup-4",
    supplierName: "Color World Traders",
    lastUpdated: "14 May 2025, 04:15 PM",
    batchNumber: "PNT-WHT-20L",
    description: "Weather-proof exterior emulsion acrylic white wall paint.",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-4",
    name: "PVC Pipe 2 inch",
    sku: "PL-0045",
    barcode: "8901234567893",
    category: "Packaging",
    unit: "Pcs (10ft)",
    currentStock: 300,
    reservedStock: 30,
    availableStock: 270,
    minimumStock: 80,
    reorderLevel: 100,
    unitCost: 150,
    sellingPrice: 210,
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    location: "Pipe Rack 2",
    status: "In Stock",
    supplierId: "sup-1",
    supplierName: "BuildWell Suppliers",
    lastUpdated: "14 May 2025, 02:00 PM",
    batchNumber: "PVC-2IN-400",
    description: "Heavy duty schedule 40 drainage and water plumbing pipe.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-5",
    name: "LED Bulb 12W",
    sku: "EL-0056",
    barcode: "8901234567894",
    category: "Others",
    unit: "Pieces",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minimumStock: 10,
    reorderLevel: 20,
    unitCost: 180,
    sellingPrice: 280,
    warehouseId: "wh-2",
    warehouseName: "Secondary Warehouse",
    location: "Aisle 1, Bin 12",
    status: "Out of Stock",
    supplierId: "sup-5",
    supplierName: "Global Electricals",
    lastUpdated: "13 May 2025, 11:10 AM",
    batchNumber: "LED-12W-B22",
    description: "Energy efficient cool day white LED bulb with B22 base cap.",
    image: "https://images.unsplash.com/photo-1550524514-9b626e2f1e63?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-6",
    name: "Nails 2 inch",
    sku: "HW-0067",
    barcode: "8901234567895",
    category: "Raw Materials",
    unit: "kg",
    currentStock: 5,
    reservedStock: 1,
    availableStock: 4,
    minimumStock: 15,
    reorderLevel: 20,
    unitCost: 120,
    sellingPrice: 160,
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    location: "Hardware Shelf D",
    status: "Low Stock",
    supplierId: "sup-2",
    supplierName: "Nepal Steel Industries",
    lastUpdated: "14 May 2025, 09:40 AM",
    description: "Galvanized iron carpenter nails for wood carpentry & forms.",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-7",
    name: "Adhesive Glue (Fevicol)",
    sku: "CH-0078",
    barcode: "8901234567896",
    category: "Others",
    unit: "Cans (1kg)",
    currentStock: 8,
    reservedStock: 0,
    availableStock: 8,
    minimumStock: 20,
    reorderLevel: 25,
    unitCost: 280,
    sellingPrice: 380,
    warehouseId: "wh-3",
    warehouseName: "Raw Material Store",
    location: "Chemical Zone C",
    status: "Low Stock",
    supplierId: "sup-1",
    supplierName: "BuildWell Suppliers",
    lastUpdated: "13 May 2025, 03:20 PM",
    description: "Synthetic resin wood adhesive for furniture and laminates.",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "item-8",
    name: "Copper Wire 1.5mm",
    sku: "EL-0089",
    barcode: "8901234567897",
    category: "Finished Goods",
    unit: "Meters",
    currentStock: 10,
    reservedStock: 2,
    availableStock: 8,
    minimumStock: 25,
    reorderLevel: 40,
    unitCost: 85,
    sellingPrice: 120,
    warehouseId: "wh-2",
    warehouseName: "Secondary Warehouse",
    location: "Coil Rack 4",
    status: "Low Stock",
    supplierId: "sup-5",
    supplierName: "Global Electricals",
    lastUpdated: "12 May 2025, 05:00 PM",
    description: "Single core PVC insulated flame retardant copper wire coil.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_SUPPLIERS: SupplierModel[] = [
  {
    id: "sup-1",
    name: "BuildWell Suppliers",
    contactPerson: "Ram Kumar Shrestha",
    phone: "+977 9856011223",
    email: "orders@buildwell.com.np",
    location: "Pokhara, Nepal",
    rating: 4.6,
    reviewCount: 120,
    categories: ["Raw Materials", "Packaging", "Plumbing"],
    paymentTerms: "Net 30 Days",
    activeOrdersCount: 2
  },
  {
    id: "sup-2",
    name: "Nepal Steel Industries",
    contactPerson: "Dinesh Adhikari",
    phone: "+977 9856044556",
    email: "sales@nepalsteel.com",
    location: "Pokhara, Nepal",
    rating: 4.8,
    reviewCount: 95,
    categories: ["Steel & Metals", "Hardware", "Fasteners"],
    paymentTerms: "Net 15 Days",
    activeOrdersCount: 3
  },
  {
    id: "sup-3",
    name: "Shree Cement Pvt. Ltd.",
    contactPerson: "Govinda Sharma",
    phone: "+977 9801233445",
    email: "dispatch@shreecement.np",
    location: "Kathmandu, Nepal",
    rating: 4.7,
    reviewCount: 88,
    categories: ["Cement", "Aggregates", "Building Materials"],
    paymentTerms: "Advance / Immediate",
    activeOrdersCount: 1
  },
  {
    id: "sup-4",
    name: "Color World Traders",
    contactPerson: "Sarita Gurung",
    phone: "+977 9846011998",
    email: "colorworldpkr@gmail.com",
    location: "Pokhara, Nepal",
    rating: 4.5,
    reviewCount: 76,
    categories: ["Paints", "Primers", "Coatings"],
    paymentTerms: "Net 30 Days",
    activeOrdersCount: 1
  },
  {
    id: "sup-5",
    name: "Global Electricals",
    contactPerson: "Sunil Maharjan",
    phone: "+977 9813009988",
    email: "info@globalelectricals.np",
    location: "Kathmandu, Nepal",
    rating: 4.6,
    reviewCount: 69,
    categories: ["Electricals", "Lighting", "Wires & Cables"],
    paymentTerms: "Net 30 Days",
    activeOrdersCount: 2
  }
];

export const INITIAL_CATEGORIES: CategoryModel[] = [
  { id: "cat-1", name: "Raw Materials", icon: "🧱", itemCount: 498, color: "#10B981", percentage: 40 },
  { id: "cat-2", name: "Finished Goods", icon: "📦", itemCount: 373, color: "#3B82F6", percentage: 30 },
  { id: "cat-3", name: "Packaging", icon: "📦", itemCount: 249, color: "#F59E0B", percentage: 20 },
  { id: "cat-4", name: "Others", icon: "⚙️", itemCount: 125, color: "#8B5CF6", percentage: 10 }
];

export const INITIAL_STOCK_IN: StockInRecord[] = [
  {
    id: "grn-1",
    grnNumber: "GRN-000124",
    supplierId: "sup-1",
    supplierName: "BuildWell Suppliers",
    poNumber: "PO-000123",
    date: "15 May 2025",
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    items: [
      { itemId: "item-1", itemName: "Steel Rod 12mm", sku: "RM-0012", quantity: 100, unitPrice: 150, totalAmount: 15000, unit: "Pieces" },
      { itemId: "item-2", itemName: "Cement OPC 43", sku: "RM-0021", quantity: 50, unitPrice: 150, totalAmount: 7500, unit: "Bags" }
    ],
    totalAmount: 22500,
    receivedBy: "Suresh Thapa",
    notes: "Material received in good condition with test certificates.",
    createdAt: "2025-05-15T10:30:00"
  },
  {
    id: "grn-2",
    grnNumber: "GRN-000123",
    supplierId: "sup-2",
    supplierName: "Nepal Steel Industries",
    poNumber: "PO-000122",
    date: "14 May 2025",
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    items: [
      { itemId: "item-1", itemName: "Steel Rod 12mm", sku: "RM-0012", quantity: 200, unitPrice: 150, totalAmount: 30000, unit: "Pieces" }
    ],
    totalAmount: 30000,
    receivedBy: "Suresh Thapa",
    notes: "Batch inspection passed.",
    createdAt: "2025-05-14T09:15:00"
  }
];

export const INITIAL_STOCK_OUT: StockOutRecord[] = [
  {
    id: "so-rec-1",
    soNumber: "SO-000456",
    customerOrDept: "Apex Builders Pvt. Ltd.",
    issueType: "Sales Order",
    date: "15 May 2025",
    warehouseId: "wh-1",
    warehouseName: "Main Warehouse",
    items: [
      { itemId: "item-1", itemName: "Steel Rod 12mm", sku: "RM-0012", quantity: 50, unitPrice: 150, totalAmount: 7500, unit: "Pieces" },
      { itemId: "item-2", itemName: "Cement OPC 43", sku: "RM-0021", quantity: 20, unitPrice: 150, totalAmount: 3000, unit: "Bags" }
    ],
    totalAmount: 10500,
    issuedBy: "Bikram Karki",
    notes: "Dispatched via Truck No. Ba 2 Ka 4590.",
    createdAt: "2025-05-15T09:15:00"
  }
];

export const INITIAL_TRANSFERS: StockTransferRecord[] = [
  {
    id: "tr-1",
    transferNumber: "TR-000789",
    fromWarehouseId: "wh-1",
    fromWarehouseName: "Main Warehouse",
    toWarehouseId: "wh-2",
    toWarehouseName: "Secondary Warehouse",
    date: "14 May 2025",
    items: [
      { itemId: "item-4", itemName: "PVC Pipe 2 inch", sku: "PL-0045", quantity: 50, unit: "Pcs" },
      { itemId: "item-3", itemName: "Paint Bucket 20L", sku: "PG-0033", quantity: 10, unit: "Buckets" }
    ],
    status: "Completed",
    transferredBy: "Suresh Thapa",
    notes: "Routine internal stock replenishment for Lakeside counter."
  }
];

export const INITIAL_STOCK_TAKE: StockTakeRecord = {
  id: "stk-1",
  referenceNo: "STK-000125",
  warehouseId: "wh-1",
  warehouseName: "Main Warehouse",
  countDate: "15 May 2025",
  totalItems: 1245,
  countedItems: 850,
  pendingItems: 320,
  varianceFound: 75,
  status: "In Progress",
  auditedBy: "Auditor Prakash",
  varianceList: [
    { itemId: "item-6", itemName: "Nails 2 inch", sku: "HW-0067", systemStock: 8, physicalStock: 5, variance: -3, unit: "kg" },
    { itemId: "item-3", itemName: "Paint Bucket 20L", sku: "PG-0033", systemStock: 18, physicalStock: 15, variance: -3, unit: "Buckets" },
    { itemId: "item-7", itemName: "Adhesive Glue", sku: "CH-0078", systemStock: 10, physicalStock: 8, variance: -2, unit: "Cans" }
  ]
};

export const INITIAL_ACTIVITY_LOGS: ActivityLogModel[] = [
  {
    id: "act-1",
    type: "received",
    title: "Stock Received",
    referenceNo: "GRN-000124 (PO-000123)",
    timestamp: "15 May 2025, 10:30 AM",
    date: "15 May 2025",
    time: "10:30 AM",
    details: "Received 100 pcs Steel Rod 12mm & 50 bags Cement OPC 43 from BuildWell Suppliers",
    user: "Suresh Thapa",
    warehouse: "Main Warehouse"
  },
  {
    id: "act-2",
    type: "issued",
    title: "Stock Issued",
    referenceNo: "SO-000456",
    timestamp: "15 May 2025, 09:15 AM",
    date: "15 May 2025",
    time: "09:15 AM",
    details: "Dispatched 50 pcs Steel Rod & 20 bags Cement to Apex Builders Pvt. Ltd.",
    user: "Bikram Karki",
    warehouse: "Main Warehouse"
  },
  {
    id: "act-3",
    type: "transfer",
    title: "Stock Transfer",
    referenceNo: "TR-000789",
    timestamp: "14 May 2025, 04:20 PM",
    date: "14 May 2025",
    time: "04:20 PM",
    details: "Transferred 50 pcs PVC Pipes and 10 Buckets Paint from Main to Secondary Warehouse",
    user: "Suresh Thapa",
    warehouse: "Main Warehouse"
  },
  {
    id: "act-4",
    type: "adjustment",
    title: "Stock Adjustment",
    referenceNo: "ADJ-000321",
    timestamp: "14 May 2025, 11:45 AM",
    date: "14 May 2025",
    time: "11:45 AM",
    details: "Wrote off 2 damaged paint buckets due to transit denting",
    user: "Anju Gurung",
    warehouse: "Secondary Warehouse"
  },
  {
    id: "act-5",
    type: "stock_take",
    title: "Stock Take Initiated",
    referenceNo: "STK-000125",
    timestamp: "14 May 2025, 09:30 AM",
    date: "14 May 2025",
    time: "09:30 AM",
    details: "Monthly cycle audit started for Aisle 1 to 4 in Main Warehouse",
    user: "Auditor Prakash",
    warehouse: "Main Warehouse"
  }
];

export const MONTHLY_TREND_DATA = [
  { month: "Dec", value: 1.8, inward: 0.6, outward: 0.5 },
  { month: "Jan", value: 2.1, inward: 0.8, outward: 0.6 },
  { month: "Feb", value: 1.9, inward: 0.5, outward: 0.7 },
  { month: "Mar", value: 2.3, inward: 0.9, outward: 0.6 },
  { month: "Apr", value: 2.2, inward: 0.7, outward: 0.8 },
  { month: "May", value: 2.45, inward: 0.85, outward: 0.62 }
];
