import React, { useState, useEffect, useRef } from "react";
import {
  InventoryItem,
  InventoryTransaction,
  InventorySupplier,
  InventoryCategory,
  InventoryAlert,
  Patient,
  InventoryUsageLog
} from "../types";
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  DollarSign,
  Barcode,
  Building2,
  Calendar,
  Clock,
  Layers,
  Settings,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Camera,
  RefreshCw,
  Trash2,
  Edit3,
  Bell,
  Send,
  Eye,
  Sliders,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart2,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Check,
  X,
  Share2,
  FileSpreadsheet
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

interface InventoryManagementTrackerProps {
  patient?: Patient;
}

const BUSINESS_TYPES = [
  { id: "retail", name: "🏪 Retail Store", icon: "🏪" },
  { id: "wholesale", name: "🏬 Wholesale Store", icon: "🏬" },
  { id: "apparel", name: "👗 Apparel Store", icon: "👗" },
  { id: "liquor", name: "🍾 Liquor Shop", icon: "🍾" },
  { id: "vegetable", name: "🥬 Vegetable Shop", icon: "🥬" },
  { id: "grocery", name: "🛒 Grocery Store", icon: "🛒" },
  { id: "electronics", name: "📱 Electronics Store", icon: "📱" },
  { id: "beauty", name: "💄 Beauty Store", icon: "💄" },
  { id: "hardware", name: "🏠 Hardware Store", icon: "🏠" },
  { id: "online", name: "📦 Online Store", icon: "📦" },
  { id: "restaurant", name: "🍽️ Restaurant", icon: "🍽️" },
  { id: "pharmacy", name: "🏥 Pharmacy", icon: "🏥" },
  { id: "bookstore", name: "📚 Bookstore", icon: "📚" },
  { id: "toy", name: "🧸 Toy Store", icon: "🧸" },
  { id: "custom", name: "📝 Custom Store", icon: "📝" }
];

const UNIT_TYPES = [
  { type: "Number", units: ["Pieces", "Units", "Items", "Packs", "Sets", "Boxes"] },
  { type: "Weight", units: ["kg", "gm", "lb", "oz", "Ton"] },
  { type: "Length", units: ["Meter (m)", "Centimeter (cm)", "Feet (ft)", "Inch (in)"] },
  { type: "Size", units: ["Small (S)", "Medium (M)", "Large (L)", "XL", "XXL", "Custom Size"] },
  { type: "Carton", units: ["Box", "Case", "Crate", "Palette", "Carton"] },
  { type: "Liquid", units: ["Liter (L)", "Milliliter (ml)", "Gallon", "Bottle", "Can"] },
  { type: "Area", units: ["sqm", "sqft"] },
  { type: "Custom", units: ["Custom Unit"] }
];

const INITIAL_CATEGORIES: InventoryCategory[] = [
  { id: "cat-1", userId: "u-1", name: "Food & Beverages", itemCount: 12, icon: "🥦", color: "bg-emerald-100 text-emerald-800", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "cat-2", userId: "u-1", name: "Electronics", itemCount: 8, icon: "📱", color: "bg-indigo-100 text-indigo-800", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "cat-3", userId: "u-1", name: "Clothing & Apparel", itemCount: 15, icon: "👗", color: "bg-pink-100 text-pink-800", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "cat-4", userId: "u-1", name: "Health & Beauty", itemCount: 6, icon: "💄", color: "bg-purple-100 text-purple-800", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "cat-5", userId: "u-1", name: "Raw Materials", itemCount: 5, icon: "📦", color: "bg-amber-100 text-amber-800", createdAt: "2026-01-01", updatedAt: "2026-01-01" }
];

const INITIAL_SUPPLIERS: InventorySupplier[] = [
  { id: "sup-1", userId: "u-1", name: "Apex Wholesale Traders", contactPerson: "Rajesh Sharma", phone: "+1 555-0192", email: "rajesh@apexwholesale.com", category: "Food & Beverages", paymentTerms: "Net 30 Days", isActive: true, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "sup-2", userId: "u-1", name: "TechParts Global Ltd.", contactPerson: "Sarah Jenkins", phone: "+1 555-0481", email: "orders@techparts.com", category: "Electronics", paymentTerms: "Immediate / COD", isActive: true, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "sup-3", userId: "u-1", name: "Evergreen Organic Farms", contactPerson: "Hari Bahadur", phone: "+1 555-0831", email: "contact@evergreenfarms.com", category: "Food & Beverages", paymentTerms: "Weekly Invoice", isActive: true, createdAt: "2026-01-01", updatedAt: "2026-01-01" }
];

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: "item-1",
    userId: "u-1",
    businessId: "retail",
    name: "Organic Whole Milk 1L",
    category: "Food & Beverages",
    sku: "MILK-ORG-1L",
    barcode: "890123456001",
    unitType: "Liquid",
    unit: "Liter (L)",
    currentStock: 18,
    minimumStock: 25,
    maximumStock: 100,
    reorderPoint: 30,
    costPrice: 2.10,
    sellingPrice: 3.50,
    supplierName: "Evergreen Organic Farms",
    supplierPhone: "+1 555-0831",
    reorderQuantity: 50,
    reorderReminder: true,
    reorderReminderLevel: 25,
    location: "Aisle 1 - Refrigerator A",
    expiryDate: "2026-08-10",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "item-2",
    userId: "u-1",
    businessId: "retail",
    name: "Basmati Rice 5kg Premium",
    category: "Food & Beverages",
    sku: "RICE-BAS-5K",
    barcode: "890123456002",
    unitType: "Weight",
    unit: "kg",
    currentStock: 45,
    minimumStock: 10,
    maximumStock: 150,
    reorderPoint: 15,
    costPrice: 8.50,
    sellingPrice: 13.99,
    supplierName: "Apex Wholesale Traders",
    supplierPhone: "+1 555-0192",
    reorderQuantity: 40,
    reorderReminder: true,
    reorderReminderLevel: 15,
    location: "Shelf B4 - Grain Storage",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "item-3",
    userId: "u-1",
    businessId: "retail",
    name: "Wireless Charging Pad 15W",
    category: "Electronics",
    sku: "ELEC-WCP-15",
    barcode: "890123456003",
    unitType: "Number",
    unit: "Pieces",
    currentStock: 4,
    minimumStock: 10,
    maximumStock: 50,
    reorderPoint: 12,
    costPrice: 9.00,
    sellingPrice: 19.99,
    supplierName: "TechParts Global Ltd.",
    supplierPhone: "+1 555-0481",
    reorderQuantity: 20,
    reorderReminder: true,
    reorderReminderLevel: 10,
    location: "Display Shelf 2",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "item-4",
    userId: "u-1",
    businessId: "retail",
    name: "Cotton Crew Neck T-Shirt (M)",
    category: "Clothing & Apparel",
    sku: "APP-TSHIRT-M",
    barcode: "890123456004",
    unitType: "Size",
    unit: "Medium (M)",
    currentStock: 0,
    minimumStock: 5,
    maximumStock: 40,
    reorderPoint: 8,
    costPrice: 5.00,
    sellingPrice: 14.50,
    supplierName: "Apex Wholesale Traders",
    reorderQuantity: 25,
    reorderReminder: true,
    reorderReminderLevel: 5,
    location: "Rack 3 - Apparel Section",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  }
];

const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: "tx-1",
    itemId: "item-1",
    userId: "u-1",
    type: "in",
    quantity: 50,
    unit: "Liter (L)",
    previousStock: 0,
    newStock: 50,
    date: "2026-07-20",
    time: "10:30 AM",
    reference: "PO-2026-881",
    notes: "Initial delivery from Evergreen Organic Farms",
    createdAt: "2026-07-20"
  },
  {
    id: "tx-2",
    itemId: "item-1",
    userId: "u-1",
    type: "out",
    quantity: 32,
    unit: "Liter (L)",
    previousStock: 50,
    newStock: 18,
    date: "2026-07-28",
    time: "04:15 PM",
    reference: "INV-2026-902",
    notes: "Counter sales",
    createdAt: "2026-07-28"
  }
];

const INITIAL_USAGE_LOGS: InventoryUsageLog[] = [
  {
    id: "log-1",
    itemId: "item-1",
    itemName: "Organic Whole Milk 1L",
    sku: "BEV-MILK-1L",
    category: "Food & Beverages",
    quantityReduced: 32,
    unit: "Liter (L)",
    previousStock: 50,
    newStock: 18,
    date: "2026-07-28",
    time: "04:15 PM",
    reason: "Counter sales & store checkout",
    updatedBy: "Store Staff"
  },
  {
    id: "log-2",
    itemId: "item-3",
    itemName: "Wireless Charging Pad 15W",
    sku: "ELEC-WCP-15",
    category: "Electronics",
    quantityReduced: 6,
    unit: "Pieces",
    previousStock: 10,
    newStock: 4,
    date: "2026-07-27",
    time: "02:20 PM",
    reason: "E-commerce order dispatch",
    updatedBy: "Warehouse Manager"
  }
];

export const InventoryManagementTracker: React.FC<InventoryManagementTrackerProps> = ({ patient }) => {
  // Navigation Screens: "dashboard" | "add_edit" | "stock_movement" | "usage_logs" | "alerts" | "reports" | "categories" | "suppliers" | "settings"
  const [activeScreen, setActiveScreen] = useState<string>("dashboard");

  // State management with localStorage persistence
  const [businessType, setBusinessType] = useState<string>(() => {
    return localStorage.getItem("care2care_inv_biz_type") || "retail";
  });

  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_inv_items");
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [transactions, setTransactions] = useState<InventoryTransaction[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_inv_transactions");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [usageLogs, setUsageLogs] = useState<InventoryUsageLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_inv_usage_logs");
      return saved ? JSON.parse(saved) : INITIAL_USAGE_LOGS;
    } catch {
      return INITIAL_USAGE_LOGS;
    }
  });

  const [categories, setCategories] = useState<InventoryCategory[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_inv_categories");
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [suppliers, setSuppliers] = useState<InventorySupplier[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_inv_suppliers");
      return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Editing State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form State for Add/Edit Item
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Food & Beverages");
  const [formSubCategory, setFormSubCategory] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formBarcode, setFormBarcode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formUnitType, setFormUnitType] = useState("Number");
  const [formUnit, setFormUnit] = useState("Pieces");
  const [formCurrentStock, setFormCurrentStock] = useState<number>(0);
  const [formMinimumStock, setFormMinimumStock] = useState<number>(10);
  const [formMaximumStock, setFormMaximumStock] = useState<number>(100);
  const [formReorderPoint, setFormReorderPoint] = useState<number>(15);
  const [formCostPrice, setFormCostPrice] = useState<number>(0);
  const [formSellingPrice, setFormSellingPrice] = useState<number>(0);
  const [formWholesalePrice, setFormWholesalePrice] = useState<number>(0);
  const [formDiscountRate, setFormDiscountRate] = useState<number>(0);
  const [formTaxRate, setFormTaxRate] = useState<number>(0);
  const [formSupplierName, setFormSupplierName] = useState("");
  const [formSupplierPhone, setFormSupplierPhone] = useState("");
  const [formReorderQuantity, setFormReorderQuantity] = useState<number>(25);
  const [formReorderReminder, setFormReorderReminder] = useState<boolean>(true);
  const [formReorderReminderLevel, setFormReorderReminderLevel] = useState<number>(15);
  const [formLocation, setFormLocation] = useState("");
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [formBatchNumber, setFormBatchNumber] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Stock Movement Form
  const [stockTxItemId, setStockTxItemId] = useState<string>("");
  const [stockTxType, setStockTxType] = useState<"in" | "out" | "adjustment" | "return" | "damage">("in");
  const [stockTxQty, setStockTxQty] = useState<number>(0);
  const [stockTxRef, setStockTxRef] = useState("");
  const [stockTxNotes, setStockTxNotes] = useState("");
  const [stockTxProofPhoto, setStockTxProofPhoto] = useState<string | null>(null);

  // Category Modal Form
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📦");
  const [showCatModal, setShowCatModal] = useState(false);

  // Supplier Modal Form
  const [newSupName, setNewSupName] = useState("");
  const [newSupContact, setNewSupContact] = useState("");
  const [newSupPhone, setNewSupPhone] = useState("");
  const [newSupEmail, setNewSupEmail] = useState("");
  const [newSupTerms, setNewSupTerms] = useState("Net 30");
  const [showSupModal, setShowSupModal] = useState(false);

  // Camera & Barcode Scanner State
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [scannedItemMatch, setScannedItemMatch] = useState<InventoryItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Report Period State
  const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Persist State
  useEffect(() => {
    localStorage.setItem("care2care_inv_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("care2care_inv_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("care2care_inv_usage_logs", JSON.stringify(usageLogs));
  }, [usageLogs]);

  useEffect(() => {
    localStorage.setItem("care2care_inv_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("care2care_inv_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("care2care_inv_biz_type", businessType);
  }, [businessType]);

  // Clean up camera stream on unmount or close
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCameraStream = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } else {
        setCameraError("Camera API not supported in this browser. You can use test barcode simulation or image upload.");
      }
    } catch (err: any) {
      setCameraError("Could not access camera. Please check permissions or use image upload / barcode lookup.");
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleScanCodeFound = (code: string) => {
    const matched = items.find((i) => i.barcode === code || i.sku === code);
    if (matched) {
      setScannedItemMatch(matched);
      setSearchQuery(matched.barcode);
      showToast(`Scanned Code: ${code} → Found: ${matched.name}`);
    } else {
      setScannedItemMatch(null);
      setFormBarcode(code);
      setFormSku("SKU-" + code.slice(-4));
      showToast(`Scanned Code: ${code} (New barcode!) - Auto-filled in Add Item form.`);
    }
  };

  // JSON Backup Export & Import
  const handleExportBackupJSON = () => {
    const backupData = {
      appName: "Care2Care Inventory Management Database",
      exportDate: new Date().toISOString(),
      businessType,
      items,
      transactions,
      usageLogs,
      categories,
      suppliers
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory_backup_${businessType}_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Database backup downloaded successfully as JSON!");
  };

  const handleImportBackupJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.items || !Array.isArray(parsed.items)) {
          alert("Invalid backup JSON file format! Missing 'items' array.");
          return;
        }

        const mode = confirm(
          `Found backup file created on ${parsed.exportDate || "Unknown Date"}.\n` +
          `• Click OK to MERGE with current inventory\n` +
          `• Click CANCEL to OVERWRITE current inventory completely`
        );

        if (mode) {
          // Merge mode
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newItems = parsed.items.filter((i: InventoryItem) => !existingIds.has(i.id));
            return [...prev, ...newItems];
          });
          if (Array.isArray(parsed.transactions)) {
            setTransactions((prev) => {
              const existingTx = new Set(prev.map((t) => t.id));
              const newTx = parsed.transactions.filter((t: InventoryTransaction) => !existingTx.has(t.id));
              return [...prev, ...newTx];
            });
          }
          if (Array.isArray(parsed.usageLogs)) {
            setUsageLogs((prev) => {
              const existingLogs = new Set(prev.map((l) => l.id));
              const newLogs = parsed.usageLogs.filter((l: InventoryUsageLog) => !existingLogs.has(l.id));
              return [...prev, ...newLogs];
            });
          }
          showToast(`Successfully merged ${parsed.items.length} inventory items!`);
        } else {
          // Overwrite mode
          setItems(parsed.items);
          if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
          if (Array.isArray(parsed.usageLogs)) setUsageLogs(parsed.usageLogs);
          if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
          if (Array.isArray(parsed.suppliers)) setSuppliers(parsed.suppliers);
          if (parsed.businessType) setBusinessType(parsed.businessType);
          showToast(`Database restored! Total items loaded: ${parsed.items.length}`);
        }
      } catch (err) {
        alert("Failed to parse JSON backup file. Ensure it is a valid JSON document.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = "";
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto Calculations & Summaries
  const totalItemsCount = items.length;
  const totalCostValue = items.reduce((acc, item) => acc + (item.currentStock * item.costPrice), 0);
  const totalSellingValue = items.reduce((acc, item) => acc + (item.currentStock * item.sellingPrice), 0);
  const lowStockItems = items.filter((item) => item.currentStock > 0 && item.currentStock <= item.minimumStock);
  const outOfStockItems = items.filter((item) => item.currentStock === 0);
  const expiringSoonItems = items.filter((item) => {
    if (!item.expiryDate) return false;
    const exp = new Date(item.expiryDate).getTime();
    const now = new Date().getTime();
    const daysDiff = (exp - now) / (1000 * 3600 * 24);
    return daysDiff >= 0 && daysDiff <= 7;
  });

  // Calculate Profit Margin
  const calculateProfitMargin = (cost: number, selling: number) => {
    if (!selling || selling <= 0) return 0;
    return (((selling - cost) / selling) * 100).toFixed(1);
  };

  // Reset Add/Edit Form
  const resetForm = () => {
    setEditingItemId(null);
    setFormName("");
    setFormCategory("Food & Beverages");
    setFormSubCategory("");
    setFormSku("SKU-" + Math.floor(1000 + Math.random() * 9000));
    setFormBarcode("890123" + Math.floor(100000 + Math.random() * 900000));
    setFormDescription("");
    setFormUnitType("Number");
    setFormUnit("Pieces");
    setFormCurrentStock(0);
    setFormMinimumStock(10);
    setFormMaximumStock(100);
    setFormReorderPoint(15);
    setFormCostPrice(0);
    setFormSellingPrice(0);
    setFormWholesalePrice(0);
    setFormDiscountRate(0);
    setFormTaxRate(0);
    setFormSupplierName("");
    setFormSupplierPhone("");
    setFormReorderQuantity(25);
    setFormReorderReminder(true);
    setFormReorderReminderLevel(15);
    setFormLocation("");
    setFormExpiryDate("");
    setFormBatchNumber("");
    setFormNotes("");
  };

  // Open Edit Form
  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormSubCategory(item.subCategory || "");
    setFormSku(item.sku);
    setFormBarcode(item.barcode);
    setFormDescription(item.description || "");
    setFormUnitType(item.unitType);
    setFormUnit(item.unit);
    setFormCurrentStock(item.currentStock);
    setFormMinimumStock(item.minimumStock);
    setFormMaximumStock(item.maximumStock || 100);
    setFormReorderPoint(item.reorderPoint);
    setFormCostPrice(item.costPrice);
    setFormSellingPrice(item.sellingPrice);
    setFormWholesalePrice(item.wholesalePrice || 0);
    setFormDiscountRate(item.discountRate || 0);
    setFormTaxRate(item.taxRate || 0);
    setFormSupplierName(item.supplierName || "");
    setFormSupplierPhone(item.supplierPhone || "");
    setFormReorderQuantity(item.reorderQuantity || 25);
    setFormReorderReminder(item.reorderReminder ?? true);
    setFormReorderReminderLevel(item.reorderReminderLevel || 15);
    setFormLocation(item.location || "");
    setFormExpiryDate(item.expiryDate || "");
    setFormBatchNumber(item.batchNumber || "");
    setFormNotes(item.notes || "");
    setActiveScreen("add_edit");
  };

  // Handle Save Item
  const handleSaveItem = (addAnother = false) => {
    if (!formName.trim()) {
      alert("Please enter item name.");
      return;
    }

    const newItem: InventoryItem = {
      id: editingItemId || "item-" + Date.now(),
      userId: "u-1",
      businessId: businessType,
      name: formName.trim(),
      category: formCategory,
      subCategory: formSubCategory.trim(),
      sku: formSku || ("SKU-" + Math.floor(1000 + Math.random() * 9000)),
      barcode: formBarcode || ("890123" + Math.floor(100000 + Math.random() * 900000)),
      description: formDescription,
      unitType: formUnitType,
      unit: formUnit,
      currentStock: Number(formCurrentStock),
      minimumStock: Number(formMinimumStock),
      maximumStock: Number(formMaximumStock),
      reorderPoint: Number(formReorderPoint),
      costPrice: Number(formCostPrice),
      sellingPrice: Number(formSellingPrice),
      wholesalePrice: Number(formWholesalePrice),
      discountRate: Number(formDiscountRate),
      taxRate: Number(formTaxRate),
      supplierName: formSupplierName,
      supplierPhone: formSupplierPhone,
      reorderQuantity: Number(formReorderQuantity),
      reorderReminder: formReorderReminder,
      reorderReminderLevel: Number(formReorderReminderLevel),
      location: formLocation,
      expiryDate: formExpiryDate,
      batchNumber: formBatchNumber,
      notes: formNotes,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingItemId) {
      setItems((prev) => prev.map((i) => (i.id === editingItemId ? newItem : i)));
      showToast("Item updated successfully!");
    } else {
      setItems((prev) => [newItem, ...prev]);
      showToast("New item created successfully!");
    }

    if (addAnother) {
      resetForm();
    } else {
      resetForm();
      setActiveScreen("dashboard");
    }
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast("Item deleted from inventory.");
    }
  };

  // Handle Stock Movement Transaction
  const handleSaveStockTx = () => {
    if (!stockTxItemId) {
      alert("Please select an item.");
      return;
    }
    if (!stockTxQty || stockTxQty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const targetItem = items.find((i) => i.id === stockTxItemId);
    if (!targetItem) return;

    let newStock = targetItem.currentStock;
    if (stockTxType === "in" || stockTxType === "return") {
      newStock += stockTxQty;
    } else if (stockTxType === "out" || stockTxType === "damage") {
      newStock = Math.max(0, newStock - stockTxQty);
    } else if (stockTxType === "adjustment") {
      newStock = stockTxQty;
    }

    const newTx: InventoryTransaction = {
      id: "tx-" + Date.now(),
      itemId: stockTxItemId,
      userId: "u-1",
      type: stockTxType,
      quantity: stockTxQty,
      unit: targetItem.unit,
      previousStock: targetItem.currentStock,
      newStock: newStock,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reference: stockTxRef || "REF-" + Math.floor(1000 + Math.random() * 9000),
      notes: stockTxNotes,
      proofPhoto: stockTxProofPhoto || undefined,
      createdAt: new Date().toISOString()
    };

    // Update Item stock
    setItems((prev) =>
      prev.map((i) => (i.id === stockTxItemId ? { ...i, currentStock: newStock, updatedAt: new Date().toISOString() } : i))
    );

    setTransactions((prev) => [newTx, ...prev]);

    // Track usage log if stock decreased
    if (newStock < targetItem.currentStock) {
      const reducedAmount = targetItem.currentStock - newStock;
      const newUsageLog: InventoryUsageLog = {
        id: "log-" + Date.now(),
        itemId: targetItem.id,
        itemName: targetItem.name,
        sku: targetItem.sku,
        category: targetItem.category,
        quantityReduced: reducedAmount,
        unit: targetItem.unit,
        previousStock: targetItem.currentStock,
        newStock: newStock,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reason: stockTxNotes || (stockTxType === "damage" ? "Stock Damage / Waste Write-off" : "Stock Consumption / Dispatch"),
        updatedBy: "Store Manager"
      };
      setUsageLogs((prev) => [newUsageLog, ...prev]);
    }

    showToast(`Stock updated! New balance: ${newStock} ${targetItem.unit}`);

    // Reset stock tx form
    setStockTxItemId("");
    setStockTxQty(0);
    setStockTxRef("");
    setStockTxNotes("");
    setStockTxProofPhoto(null);
  };

  // Barcode Scanner Simulator
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const randomItem = items[Math.floor(Math.random() * items.length)];
      if (randomItem) {
        setSearchQuery(randomItem.barcode);
        showToast(`Scanned Barcode: ${randomItem.barcode} (${randomItem.name})`);
      }
    }, 1200);
  };

  // Add Category Handler
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const cat: InventoryCategory = {
      id: "cat-" + Date.now(),
      userId: "u-1",
      name: newCatName.trim(),
      icon: newCatIcon || "📦",
      color: "bg-blue-100 text-blue-800",
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCategories((prev) => [...prev, cat]);
    setNewCatName("");
    setShowCatModal(false);
    showToast("New category added!");
  };

  // Add Supplier Handler
  const handleAddSupplier = () => {
    if (!newSupName.trim()) return;
    const sup: InventorySupplier = {
      id: "sup-" + Date.now(),
      userId: "u-1",
      name: newSupName.trim(),
      contactPerson: newSupContact,
      phone: newSupPhone,
      email: newSupEmail,
      paymentTerms: newSupTerms,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSuppliers((prev) => [...prev, sup]);
    setNewSupName("");
    setNewSupContact("");
    setNewSupPhone("");
    setNewSupEmail("");
    setShowSupModal(false);
    showToast("Supplier saved!");
  };

  // Filtered Item List
  const filteredItems = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.barcode.toLowerCase().includes(q) ||
      (item.supplierName && item.supplierName.toLowerCase().includes(q));

    const matchesCategory = selectedCategoryTab === "all" || item.category === selectedCategoryTab;

    let matchesStatus = true;
    if (statusFilter === "low") matchesStatus = item.currentStock > 0 && item.currentStock <= item.minimumStock;
    if (statusFilter === "out") matchesStatus = item.currentStock === 0;
    if (statusFilter === "normal") matchesStatus = item.currentStock > item.minimumStock;
    if (statusFilter === "expiring") {
      if (!item.expiryDate) matchesStatus = false;
      else {
        const exp = new Date(item.expiryDate).getTime();
        const now = new Date().getTime();
        const daysDiff = (exp - now) / (1000 * 3600 * 24);
        matchesStatus = daysDiff >= 0 && daysDiff <= 7;
      }
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Prepare Recharts Data
  const getCategoryDistributionData = () => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key]
    }));
  };

  const getStockMovementData = () => {
    return [
      { date: "Jul 23", in: 120, out: 85 },
      { date: "Jul 24", in: 95, out: 110 },
      { date: "Jul 25", in: 200, out: 140 },
      { date: "Jul 26", in: 150, out: 160 },
      { date: "Jul 27", in: 80, out: 95 },
      { date: "Jul 28", in: 220, out: 180 },
      { date: "Jul 29", in: 180, out: 130 }
    ];
  };

  const COLORS = ["#10b981", "#6366f1", "#ec4899", "#f59e0b", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR & SCREEN SWITCHER */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                Inventory Management
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  Full Suite
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Multi-store stock tracking, reorder reminders, margins & analytics
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setActiveScreen("add_edit");
            }}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Business Type Selector & Screen Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={businessType}
              onChange={(e) => {
                setBusinessType(e.target.value);
                showToast(`Switched store type to ${e.target.value.toUpperCase()}`);
              }}
              className="text-xs font-extrabold bg-slate-50 border border-slate-200 text-slate-800 px-2.5 py-1.5 rounded-xl cursor-pointer focus:outline-none"
            >
              {BUSINESS_TYPES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Screen Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs font-extrabold">
            {[
              { id: "dashboard", label: "Dashboard", icon: Package },
              { id: "stock_movement", label: "Stock In/Out", icon: ArrowUpRight },
              { id: "usage_logs", label: "Usage Logs", icon: Clock },
              { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: lowStockItems.length + outOfStockItems.length },
              { id: "reports", label: "Reports", icon: BarChart2 },
              { id: "categories", label: "Categories", icon: Layers },
              { id: "suppliers", label: "Suppliers", icon: Building2 },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-black">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SCREEN 1: MAIN INVENTORY DASHBOARD */}
      {/* ============================================================ */}
      {activeScreen === "dashboard" && (
        <div className="space-y-4">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Total Items</span>
              <p className="text-xl font-black text-slate-900">{totalItemsCount}</p>
              <p className="text-[10px] text-slate-400 font-medium">In active inventory</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Inventory Cost Value</span>
              <p className="text-xl font-black text-emerald-600">${totalCostValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <p className="text-[10px] text-slate-400 font-medium">Selling: ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-800">Low Stock Warning</span>
              <p className="text-xl font-black text-amber-900">{lowStockItems.length} items</p>
              <p className="text-[10px] text-amber-700 font-medium">Below minimum stock</p>
            </div>

            <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-orange-800">Soon to Expire</span>
              <p className="text-xl font-black text-orange-900">{expiringSoonItems.length} items</p>
              <p className="text-[10px] text-orange-700 font-medium">Expiring within 7 days</p>
            </div>

            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-rose-800">Out of Stock</span>
              <p className="text-xl font-black text-rose-900">{outOfStockItems.length} items</p>
              <p className="text-[10px] text-rose-700 font-medium">Needs immediate reorder</p>
            </div>
          </div>

          {/* Soon to Expire (Next 7 Days) Banner / Section */}
          {expiringSoonItems.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-900 font-extrabold text-xs">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>⏰ Soon to Expire Section (Next 7 Days)</span>
                  <span className="bg-orange-200 text-orange-900 text-[10px] px-2 py-0.5 rounded-full font-black">
                    {expiringSoonItems.length} {expiringSoonItems.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
                <button
                  onClick={() => setStatusFilter("expiring")}
                  className="text-[11px] font-bold text-orange-800 hover:underline cursor-pointer"
                >
                  Filter Inventory List →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {expiringSoonItems.map((expItem) => {
                  const daysLeft = Math.ceil(
                    (new Date(expItem.expiryDate!).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                  );
                  return (
                    <div key={expItem.id} className="bg-white p-2.5 rounded-xl border border-orange-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{expItem.name}</p>
                        <p className="text-[10px] text-orange-600 font-medium">
                          Expires in {daysLeft <= 0 ? "Today" : `${daysLeft} day(s)`} ({expItem.expiryDate})
                        </p>
                      </div>
                      <span className="font-extrabold text-slate-700 text-[11px] bg-slate-100 px-2 py-1 rounded-lg shrink-0">
                        {expItem.currentStock} {expItem.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alert Banners if any */}
          {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-3.5 rounded-2xl text-white shadow-xs flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>
                  ⚠️ Alert: {outOfStockItems.length} item(s) out of stock & {lowStockItems.length} item(s) running low.
                </span>
              </div>
              <button
                onClick={() => setActiveScreen("alerts")}
                className="px-3 py-1 bg-white text-slate-900 rounded-xl text-[11px] font-extrabold hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              >
                Review Alerts
              </button>
            </div>
          )}

          {/* Quick Action Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setActiveScreen("add_edit");
                }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Item
              </button>
              <button
                onClick={() => setActiveScreen("stock_movement")}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Stock In / Out
              </button>
              <button
                onClick={() => {
                  setShowCameraScanner(true);
                  startCameraStream();
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-2xs text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" /> Camera Barcode/QR Scanner
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBackupJSON}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                title="Export Database to JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" /> Export JSON
              </button>
              <label className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-600" /> Import JSON
                <input type="file" accept=".json" onChange={handleImportBackupJSON} className="hidden" />
              </label>
              <button
                onClick={() => setActiveScreen("reports")}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5" /> Reports
              </button>
            </div>
          </div>

          {/* Search, Status & Category Filters */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search item name, SKU, barcode, category or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-2xl cursor-pointer"
                >
                  <option value="all">All Stock Status</option>
                  <option value="normal">🟢 In Stock</option>
                  <option value="low">🟡 Low Stock</option>
                  <option value="out">🔴 Out of Stock</option>
                  <option value="expiring">⏰ Soon to Expire (Next 7 Days)</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs font-bold">
              <button
                onClick={() => setSelectedCategoryTab("all")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  selectedCategoryTab === "all" ? "bg-emerald-600 text-white font-black" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Categories ({items.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.name)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                    selectedCategoryTab === cat.name ? "bg-emerald-600 text-white font-black" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.icon} {cat.name} ({items.filter((i) => i.category === cat.name).length})
                </button>
              ))}
            </div>
          </div>

          {/* Item Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Showing {filteredItems.length} Item(s)</span>
              <span>Sorted by Recency</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No items found</p>
                <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isOut = item.currentStock === 0;
                const isLow = item.currentStock > 0 && item.currentStock <= item.minimumStock;
                const margin = calculateProfitMargin(item.costPrice, item.sellingPrice);

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-3xl p-4 space-y-3 shadow-2xs transition-all ${
                      isOut ? "border-rose-300 bg-rose-50/20" : isLow ? "border-amber-300 bg-amber-50/20" : "border-slate-200/90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-800">{item.name}</h3>
                          {isOut && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full">
                              Out of Stock
                            </span>
                          )}
                          {isLow && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">
                              Low Stock ({item.currentStock} {item.unit})
                            </span>
                          )}
                          {!isOut && !isLow && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                              In Stock
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-700">
                            {item.category}
                          </span>
                          <span>SKU: <strong className="text-slate-800">{item.sku}</strong></span>
                          <span>Barcode: <strong className="text-slate-800">{item.barcode}</strong></span>
                          {item.location && <span>📍 {item.location}</span>}
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setStockTxItemId(item.id);
                            setActiveScreen("stock_movement");
                          }}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Stock In / Out"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stock & Pricing Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Current Quantity</span>
                        <span className="font-black text-slate-900 text-sm">
                          {item.currentStock} {item.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Min / Reorder</span>
                        <span className="font-bold text-slate-700">
                          Min: {item.minimumStock} | Reorder: {item.reorderPoint}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Cost / Selling</span>
                        <span className="font-bold text-slate-800">
                          Cost: ${item.costPrice} | Sell: <strong className="text-emerald-600">${item.sellingPrice}</strong>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Margin Rate</span>
                        <span className="font-black text-indigo-700">
                          {margin}% Margin
                        </span>
                      </div>
                    </div>

                    {/* Supplier & Expiry info if present */}
                    {(item.supplierName || item.expiryDate) && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                        {item.supplierName && (
                          <span>🏢 Supplier: <strong className="text-slate-800">{item.supplierName}</strong></span>
                        )}
                        {item.expiryDate && (
                          <span className="text-rose-600 font-bold">📅 Expiry: {item.expiryDate}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 2: ADD / EDIT ITEM - FULL FORM */}
      {/* ============================================================ */}
      {activeScreen === "add_edit" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              {editingItemId ? "Edit Inventory Item" : "Add New Inventory Item"}
            </h2>
            <button
              onClick={() => {
                resetForm();
                setActiveScreen("dashboard");
              }}
              className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveItem(false);
            }}
            className="space-y-6"
          >
            {/* SECTION 1: BASIC INFO */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b pb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Section 1: Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Item Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Whole Milk 1L"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sub-Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Dairy / Fresh Milk"
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Barcode Number</label>
                  <input
                    type="text"
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Warehouse / Shelf Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Aisle 3 - Shelf B"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional item details..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* SECTION 2: UNIT & QUANTITY */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b pb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Section 2: Unit & Quantity Tracking
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Unit Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formUnitType}
                    onChange={(e) => {
                      setFormUnitType(e.target.value);
                      const group = UNIT_TYPES.find((u) => u.type === e.target.value);
                      if (group) setFormUnit(group.units[0]);
                    }}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    {UNIT_TYPES.map((u) => (
                      <option key={u.type} value={u.type}>
                        {u.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Specific Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    {(UNIT_TYPES.find((u) => u.type === formUnitType)?.units || ["Pieces"]).map((ut) => (
                      <option key={ut} value={ut}>
                        {ut}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Stock <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formCurrentStock}
                    onChange={(e) => setFormCurrentStock(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Minimum Stock (Low Stock Trigger) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMinimumStock}
                    onChange={(e) => setFormMinimumStock(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Maximum Capacity Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={formMaximumStock}
                    onChange={(e) => setFormMaximumStock(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reorder Point Level</label>
                  <input
                    type="number"
                    min="1"
                    value={formReorderPoint}
                    onChange={(e) => setFormReorderPoint(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PRICING & MARGINS */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b pb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Section 3: Pricing & Auto-Calculated Margins
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cost Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Selling Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Wholesale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formWholesalePrice}
                    onChange={(e) => setFormWholesalePrice(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formDiscountRate}
                    onChange={(e) => setFormDiscountRate(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    value={formTaxRate}
                    onChange={(e) => setFormTaxRate(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Profit Margin</span>
                  <span className="text-base font-black text-emerald-900">
                    {calculateProfitMargin(formCostPrice, formSellingPrice)}% Profit Margin
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 4: SUPPLIER INFO & REORDER */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b pb-1">
                <Building2 className="w-3.5 h-3.5 text-purple-600" /> Section 4: Supplier & Reorder Reminders
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Supplier Name</label>
                  <select
                    value={formSupplierName}
                    onChange={(e) => {
                      setFormSupplierName(e.target.value);
                      const sup = suppliers.find((s) => s.name === e.target.value);
                      if (sup) setFormSupplierPhone(sup.phone);
                    }}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reorder Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formReorderQuantity}
                    onChange={(e) => setFormReorderQuantity(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Enable Automatic Reorder Reminder</span>
                      <span className="text-[10px] text-slate-400">Triggers notification when stock drops to or below reorder level</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formReorderReminder}
                    onChange={(e) => setFormReorderReminder(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: EXPIRY & BATCH */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b pb-1">
                <Calendar className="w-3.5 h-3.5 text-rose-600" /> Section 5: Expiry & Batch Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expiry Date (If applicable)</label>
                  <input
                    type="date"
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Batch / Lot Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BATCH-2026-X1"
                    value={formBatchNumber}
                    onChange={(e) => setFormBatchNumber(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* FORM ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveScreen("dashboard");
                }}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleSaveItem(true)}
                className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
              >
                Save & Add Another
              </button>

              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer active:scale-98"
              >
                {editingItemId ? "Update Item Details" : "Save & Create Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 3: STOCK MANAGEMENT (IN / OUT / ADJUSTMENT) */}
      {/* ============================================================ */}
      {activeScreen === "stock_movement" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
              <ArrowUpRight className="w-5 h-5 text-indigo-600" />
              Stock Movement Manager (In, Out, Adjustment, Return, Damage)
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Select Inventory Item <span className="text-rose-500">*</span>
                </label>
                <select
                  value={stockTxItemId}
                  onChange={(e) => setStockTxItemId(e.target.value)}
                  className="w-full font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                >
                  <option value="">-- Choose Item --</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Current Stock: {i.currentStock} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              {stockTxItemId && (
                <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100 flex items-center justify-between font-bold">
                  <span>Selected Stock:</span>
                  <span className="text-sm font-black text-indigo-900">
                    {items.find((i) => i.id === stockTxItemId)?.currentStock}{" "}
                    {items.find((i) => i.id === stockTxItemId)?.unit}
                  </span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transaction Type</label>
                <div className="grid grid-cols-5 gap-1.5 font-extrabold text-[11px]">
                  {[
                    { id: "in", label: "📥 Stock In" },
                    { id: "out", label: "📤 Stock Out" },
                    { id: "adjustment", label: "⚙️ Adjust" },
                    { id: "return", label: "↩️ Return" },
                    { id: "damage", label: "⚠️ Damage" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setStockTxType(t.id as any)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        stockTxType === t.id
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockTxQty}
                    onChange={(e) => setStockTxQty(Number(e.target.value))}
                    className="w-full font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reference (Invoice / PO #)</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-2026-901"
                    value={stockTxRef}
                    onChange={(e) => setStockTxRef(e.target.value)}
                    className="w-full font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Received new shipment from vendor"
                  value={stockTxNotes}
                  onChange={(e) => setStockTxNotes(e.target.value)}
                  className="w-full font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Photo Proof Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Proof Photo (Optional)</label>
                <label className="p-3 bg-slate-50 border border-dashed hover:border-indigo-500 rounded-xl font-bold text-xs text-slate-700 flex items-center justify-center cursor-pointer">
                  <Camera className="w-4 h-4 text-indigo-600 mr-2" />
                  {stockTxProofPhoto ? "Photo Attached ✓" : "Upload Delivery Receipt / Photo Proof"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setStockTxProofPhoto(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <button
                onClick={handleSaveStockTx}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm & Log Stock Transaction
              </button>
            </div>
          </div>

          {/* Recent Transactions History */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Transaction History Log</h3>
            <div className="space-y-2">
              {transactions.map((tx) => {
                const item = items.find((i) => i.id === tx.itemId);
                return (
                  <div key={tx.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        tx.type === "in" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {tx.type === "in" ? "📥" : "📤"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item?.name || "Inventory Item"}</h4>
                        <p className="text-[10px] text-slate-400">
                          {tx.date} {tx.time} • Ref: {tx.reference}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-black ${tx.type === "in" ? "text-emerald-700" : "text-rose-700"}`}>
                        {tx.type === "in" ? "+" : "-"}{tx.quantity} {tx.unit}
                      </span>
                      <p className="text-[10px] text-slate-400">New Stock: {tx.newStock}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN: ITEM USAGE LOGS & CONSUMPTION TRACKER */}
      {/* ============================================================ */}
      {activeScreen === "usage_logs" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-black text-slate-800">
                    Item Usage Log & Consumption History
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tracks every instance when item quantity was decreased to analyze consumption rate and sales velocity
                  </p>
                </div>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 font-extrabold px-3 py-1 rounded-full">
                {usageLogs.length} Decreases Recorded
              </span>
            </div>

            {/* Total Usage Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Items Reduced</span>
                <p className="text-lg font-black text-slate-900">
                  {usageLogs.reduce((acc, log) => acc + log.quantityReduced, 0)} Units
                </p>
              </div>

              <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-800 uppercase">Most Consumed Category</span>
                <p className="text-sm font-black text-indigo-900">
                  {categories[0]?.name || "Food & Beverages"}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Average Daily Decrease</span>
                <p className="text-sm font-black text-emerald-900">
                  ~{(usageLogs.reduce((acc, log) => acc + log.quantityReduced, 0) / 7).toFixed(1)} Units / day
                </p>
              </div>
            </div>

            {/* Usage Log Table / List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-600 uppercase">Recent Consumption Events</h3>

              {usageLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-600">No usage logs recorded yet</p>
                  <p className="text-[10px] text-slate-400">
                    When stock quantities decrease during Stock Out or Damage adjustments, logs appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {usageLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-all rounded-2xl border border-slate-200/90 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-800">{log.itemName}</h4>
                          <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.2 rounded-md">
                            {log.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">SKU: {log.sku}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Reason: <strong className="text-slate-700">{log.reason}</strong> • By: {log.updatedBy || "Manager"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Date: {log.date} at {log.time}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-rose-600 block">
                          -{log.quantityReduced} {log.unit}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {log.previousStock} → {log.newStock} stock remaining
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 4: LOW STOCK ALERTS & REMINDERS */}
      {/* ============================================================ */}
      {activeScreen === "alerts" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Low Stock Alerts & Reorder Reminders
              </h2>
              <button
                onClick={() => {
                  const alertText = items
                    .filter((i) => i.currentStock <= i.minimumStock)
                    .map((i) => `• ${i.name}: Stock ${i.currentStock} ${i.unit} (Supplier: ${i.supplierName || 'N/A'})`)
                    .join("\n");
                  navigator.clipboard.writeText(`REORDER LIST:\n${alertText}`);
                  showToast("Reorder list copied to clipboard!");
                }}
                className="py-1.5 px-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Copy Reorder List
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase">Items Requiring Attention</h3>

              {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">All stock levels are healthy!</p>
                  <p className="text-[11px] text-emerald-700">No low stock or out-of-stock items detected.</p>
                </div>
              ) : (
                [...outOfStockItems, ...lowStockItems].map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-amber-200 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-800">{item.name}</h4>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">
                          Current: {item.currentStock} / Min: {item.minimumStock} {item.unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supplier: <strong className="text-slate-800">{item.supplierName || "Default Supplier"}</strong> • Phone: {item.supplierPhone || "N/A"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setStockTxItemId(item.id);
                        setStockTxType("in");
                        setStockTxQty(item.reorderQuantity || 25);
                        setActiveScreen("stock_movement");
                      }}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Quick Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 5: REPORTS & ANALYTICS */}
      {/* ============================================================ */}
      {activeScreen === "reports" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                Inventory Reports & Stock Analytics
              </h2>

              <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 p-1 rounded-xl">
                {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setReportPeriod(p)}
                    className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer ${
                      reportPeriod === p ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Visualizations */}
            <div className="space-y-6">
              {/* Chart 1: Stock Movement Trend Line Chart */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Stock In vs Stock Out Movement
                </h3>
                <div className="w-full h-56 pt-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getStockMovementData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                      <Line type="monotone" dataKey="in" name="Stock In" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="out" name="Stock Out" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category Distribution Pie Chart */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-indigo-600" /> Inventory Category Distribution
                </h3>
                <div className="w-full h-52 pt-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCategoryDistributionData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {getCategoryDistributionData().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Export Report Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 6: CATEGORY MANAGEMENT */}
      {/* ============================================================ */}
      {activeScreen === "categories" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> Category Manager
              </h2>
              <button
                onClick={() => setShowCatModal(true)}
                className="py-1.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const count = items.filter((i) => i.category === cat.name).length;
                return (
                  <div key={cat.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{cat.name}</h4>
                        <p className="text-[10px] text-slate-400">{count} Item(s) in category</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 7: SUPPLIER MANAGEMENT */}
      {/* ============================================================ */}
      {activeScreen === "suppliers" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" /> Supplier Directory
              </h2>
              <button
                onClick={() => setShowSupModal(true)}
                className="py-1.5 px-3 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Supplier
              </button>
            </div>

            <div className="space-y-3">
              {suppliers.map((sup) => (
                <div key={sup.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{sup.name}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Contact: <strong>{sup.contactPerson}</strong> • Phone: {sup.phone} • Email: {sup.email}
                    </p>
                    <p className="text-indigo-600 font-bold text-[10px] mt-1">Payment Terms: {sup.paymentTerms}</p>
                  </div>

                  <a
                    href={`tel:${sup.phone}`}
                    className="py-2 px-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 8: SETTINGS */}
      {/* ============================================================ */}
      {activeScreen === "settings" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
              <Settings className="w-5 h-5 text-slate-700" /> Inventory Settings & Backup
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Store Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                >
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
                <span className="font-black text-indigo-900 block text-xs">JSON Backup & Restore</span>
                <p className="text-[11px] text-indigo-700">
                  Export complete inventory database (items, transactions, usage logs, categories, suppliers) to a JSON file or restore from backup.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleExportBackupJSON}
                    className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download JSON Backup
                  </button>
                  <label className="py-2 px-3 bg-white border border-indigo-300 text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer hover:bg-indigo-50">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" /> Import JSON Backup
                    <input type="file" accept=".json" onChange={handleImportBackupJSON} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                <span className="font-black text-rose-900 block text-xs">Reset Demo Data</span>
                <p className="text-[11px] text-rose-700">Restore default demo inventory items and transactions.</p>
                <button
                  onClick={() => {
                    if (confirm("Reset all inventory items to default demo state?")) {
                      setItems(INITIAL_ITEMS);
                      setTransactions(INITIAL_TRANSACTIONS);
                      setUsageLogs(INITIAL_USAGE_LOGS);
                      showToast("Inventory restored to initial demo data!");
                    }
                  }}
                  className="py-2 px-3 bg-rose-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMERA BARCODE / QR SCANNER */}
      {showCameraScanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-slate-800 text-sm">Product Barcode & QR Code Scanner</h3>
              </div>
              <button
                onClick={() => {
                  stopCameraStream();
                  setShowCameraScanner(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Preview or Fallback */}
            <div className="relative overflow-hidden rounded-2xl bg-black border border-slate-800 aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay Frame */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-28 border-2 border-emerald-400 border-dashed rounded-xl relative animate-pulse">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-500 shadow-sm opacity-80" />
                </div>
              </div>

              {!isCameraActive && (
                <div className="absolute inset-0 bg-slate-900/90 text-white p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <Camera className="w-8 h-8 text-slate-400" />
                  <p className="text-xs font-bold">{cameraError || "Camera feed standby"}</p>
                  <button
                    onClick={startCameraStream}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Turn On Camera Stream
                  </button>
                </div>
              )}
            </div>

            {/* Scan Simulation & Quick Test Buttons */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-extrabold text-slate-700 block">
                Simulate / Select Product Barcode Code:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {items.slice(0, 4).map((i) => (
                  <button
                    key={i.id}
                    onClick={() => handleScanCodeFound(i.barcode)}
                    className="p-2 bg-slate-100 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 rounded-xl font-bold text-left text-[11px] truncate cursor-pointer"
                  >
                    📦 {i.name} ({i.barcode})
                  </button>
                ))}
              </div>
            </div>

            {/* Matched Result Card */}
            {scannedItemMatch ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800">Item Found in Inventory</span>
                  <span className="text-xs font-bold text-emerald-700">Stock: {scannedItemMatch.currentStock} {scannedItemMatch.unit}</span>
                </div>
                <h4 className="font-black text-slate-900 text-xs">{scannedItemMatch.name}</h4>
                <p className="text-[11px] text-slate-600">
                  Category: {scannedItemMatch.category} | Cost: ${scannedItemMatch.costPrice} | Sell: ${scannedItemMatch.sellingPrice}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setStockTxItemId(scannedItemMatch.id);
                      setStockTxType("in");
                      stopCameraStream();
                      setShowCameraScanner(false);
                      setActiveScreen("stock_movement");
                    }}
                    className="flex-1 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Restock Item
                  </button>
                  <button
                    onClick={() => {
                      handleOpenEdit(scannedItemMatch);
                      stopCameraStream();
                      setShowCameraScanner(false);
                    }}
                    className="flex-1 py-1.5 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Edit Item
                  </button>
                </div>
              </div>
            ) : formBarcode ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-800">New Unregistered Barcode</span>
                <p className="font-bold text-slate-800 text-xs">Code: {formBarcode}</p>
                <button
                  onClick={() => {
                    stopCameraStream();
                    setShowCameraScanner(false);
                    setActiveScreen("add_edit");
                  }}
                  className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Create New Item with this Barcode
                </button>
              </div>
            ) : null}

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => {
                  stopCameraStream();
                  setShowCameraScanner(false);
                }}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="font-black text-slate-800 text-sm">Create New Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border rounded-xl"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowCatModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={handleAddCategory} className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPLIER */}
      {showSupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="font-black text-slate-800 text-sm">Add New Supplier</h3>
            <input
              type="text"
              placeholder="Supplier Company Name"
              value={newSupName}
              onChange={(e) => setNewSupName(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border rounded-xl"
            />
            <input
              type="text"
              placeholder="Contact Person Name"
              value={newSupContact}
              onChange={(e) => setNewSupContact(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border rounded-xl"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newSupPhone}
              onChange={(e) => setNewSupPhone(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border rounded-xl"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newSupEmail}
              onChange={(e) => setNewSupEmail(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border rounded-xl"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowSupModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={handleAddSupplier} className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs">
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InventoryManagementTracker;
