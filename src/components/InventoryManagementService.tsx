import React, { useState, useEffect } from "react";
import { InventoryHeader } from "./inventory/InventoryHeader";
import { InventoryNavScroll } from "./inventory/InventoryNavScroll";
import { ScreenOverview } from "./inventory/ScreenOverview";
import { ScreenItems } from "./inventory/ScreenItems";
import { ScreenItemDetails } from "./inventory/ScreenItemDetails";
import { ScreenStockIn } from "./inventory/ScreenStockIn";
import { ScreenStockOut } from "./inventory/ScreenStockOut";
import { ScreenWarehouses } from "./inventory/ScreenWarehouses";
import { ScreenStockTake } from "./inventory/ScreenStockTake";
import { ScreenReportsAnalytics } from "./inventory/ScreenReportsAnalytics";
import { ScreenLowStockAlerts } from "./inventory/ScreenLowStockAlerts";
import { ScreenSuppliers } from "./inventory/ScreenSuppliers";
import { ScreenTransfers } from "./inventory/ScreenTransfers";
import { ScreenActivityLog } from "./inventory/ScreenActivityLog";
import { ScreenSettings } from "./inventory/ScreenSettings";
import { InventoryModals } from "./inventory/InventoryModals";

import {
  InventoryTab,
  InventoryItemModel,
  WarehouseModel,
  SupplierModel,
  CategoryModel,
  StockInRecord,
  StockOutRecord,
  StockTransferRecord,
  StockTakeRecord,
  ActivityLogModel
} from "./inventory/types";

import {
  INITIAL_CATEGORIES,
  INITIAL_WAREHOUSES,
  INITIAL_SUPPLIERS,
  INITIAL_ITEMS,
  INITIAL_STOCK_IN,
  INITIAL_STOCK_OUT,
  INITIAL_TRANSFERS,
  INITIAL_STOCK_TAKE,
  INITIAL_ACTIVITY_LOGS
} from "./inventory/mockData";

export const InventoryManagementService: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<InventoryTab>("overview");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItemModel | null>(null);

  // Persistent Domain States
  const [items, setItems] = useState<InventoryItemModel[]>(() => {
    const saved = localStorage.getItem("inventory_service_items_v2");
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [warehouses, setWarehouses] = useState<WarehouseModel[]>(() => {
    const saved = localStorage.getItem("inventory_service_warehouses_v2");
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  const [suppliers, setSuppliers] = useState<SupplierModel[]>(() => {
    const saved = localStorage.getItem("inventory_service_suppliers_v2");
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [stockInHistory, setStockInHistory] = useState<StockInRecord[]>(() => {
    const saved = localStorage.getItem("inventory_service_stock_in_v2");
    return saved ? JSON.parse(saved) : INITIAL_STOCK_IN;
  });

  const [stockOutHistory, setStockOutHistory] = useState<StockOutRecord[]>(() => {
    const saved = localStorage.getItem("inventory_service_stock_out_v2");
    return saved ? JSON.parse(saved) : INITIAL_STOCK_OUT;
  });

  const [transfers, setTransfers] = useState<StockTransferRecord[]>(() => {
    const saved = localStorage.getItem("inventory_service_transfers_v2");
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [stockTake, setStockTake] = useState<StockTakeRecord>(() => {
    const saved = localStorage.getItem("inventory_service_stock_take_v2");
    return saved ? JSON.parse(saved) : INITIAL_STOCK_TAKE;
  });

  const [activities, setActivities] = useState<ActivityLogModel[]>(() => {
    const saved = localStorage.getItem("inventory_service_activities_v2");
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Modal State
  const [modalType, setModalType] = useState<string | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<InventoryItemModel | null>(null);

  // Synchronize with LocalStorage
  useEffect(() => {
    localStorage.setItem("inventory_service_items_v2", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("inventory_service_warehouses_v2", JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem("inventory_service_suppliers_v2", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("inventory_service_stock_in_v2", JSON.stringify(stockInHistory));
  }, [stockInHistory]);

  useEffect(() => {
    localStorage.setItem("inventory_service_stock_out_v2", JSON.stringify(stockOutHistory));
  }, [stockOutHistory]);

  useEffect(() => {
    localStorage.setItem("inventory_service_transfers_v2", JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem("inventory_service_activities_v2", JSON.stringify(activities));
  }, [activities]);

  // Derived low stock items
  const lowStockItems = items.filter(
    (i) => i.status === "Low Stock" || i.status === "Out of Stock" || i.currentStock <= i.minimumStock
  );

  // Filter items by active warehouse
  const displayedItems =
    selectedWarehouseId === "all"
      ? items
      : items.filter((it) => it.warehouseId === selectedWarehouseId);

  // Action: Add / Update Item
  const handleSaveItem = (data: Partial<InventoryItemModel>) => {
    if (data.id) {
      setItems((prev) =>
        prev.map((it) => (it.id === data.id ? ({ ...it, ...data } as InventoryItemModel) : it))
      );
      if (selectedItem && selectedItem.id === data.id) {
        setSelectedItem((prev) => ({ ...prev!, ...data } as InventoryItemModel));
      }
    } else {
      const stockVal = data.currentStock || 0;
      const minVal = data.minimumStock || 10;
      const statusVal: "In Stock" | "Low Stock" | "Out of Stock" =
        stockVal === 0 ? "Out of Stock" : stockVal <= minVal ? "Low Stock" : "In Stock";

      const newItem: InventoryItemModel = {
        id: `item-${Date.now()}`,
        name: data.name || "New Item",
        sku: data.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: data.category || "Raw Materials",
        unit: data.unit || "Pieces",
        currentStock: stockVal,
        reservedStock: 0,
        availableStock: stockVal,
        minimumStock: minVal,
        reorderLevel: data.reorderLevel || 20,
        unitCost: data.unitCost || 100,
        sellingPrice: data.sellingPrice || 150,
        warehouseId: data.warehouseId || warehouses[0]?.id || "wh-1",
        warehouseName: data.warehouseName || warehouses[0]?.name || "Main Warehouse",
        location: data.location || "Aisle 1",
        supplierId: data.supplierId || suppliers[0]?.id || "sup-1",
        supplierName: data.supplierName || suppliers[0]?.name || "Default Supplier",
        image: data.image || "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=300&auto=format&fit=crop&q=80",
        description: data.description || "Hardware & inventory item",
        barcode: data.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        status: statusVal,
        lastUpdated: "Just now"
      };
      setItems((prev) => [newItem, ...prev]);

      // Add to activity log
      const newAct: ActivityLogModel = {
        id: `act-${Date.now()}`,
        type: "adjustment",
        title: `Added New SKU: ${newItem.name}`,
        referenceNo: newItem.sku,
        timestamp: "Just now",
        details: `Initial stock ${newItem.currentStock} ${newItem.unit} registered in ${newItem.warehouseName}`,
        date: "Today",
        time: "Just now",
        user: "Admin",
        warehouse: newItem.warehouseName
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  // Action: Adjust Stock
  const handleAdjustStock = (itemId: string, diff: number, reason: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const newStock = Math.max(0, it.currentStock + diff);
          const newStatus: "In Stock" | "Low Stock" | "Out of Stock" =
            newStock === 0 ? "Out of Stock" : newStock <= it.minimumStock ? "Low Stock" : "In Stock";
          const updated: InventoryItemModel = {
            ...it,
            currentStock: newStock,
            availableStock: Math.max(0, newStock - it.reservedStock),
            status: newStatus,
            lastUpdated: "Just now"
          };
          if (selectedItem && selectedItem.id === itemId) {
            setSelectedItem(updated);
          }
          return updated;
        }
        return it;
      })
    );

    const targetItem = items.find((i) => i.id === itemId);
    const newAct: ActivityLogModel = {
      id: `act-${Date.now()}`,
      type: "adjustment",
      title: `Stock Adjustment: ${targetItem?.name}`,
      referenceNo: `ADJ-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: "Just now",
      details: `${diff >= 0 ? `+${diff}` : diff} ${targetItem?.unit} adjusted (${reason})`,
      date: "Today",
      time: "Just now",
      user: "Auditor",
      warehouse: targetItem?.warehouseName || "Main Warehouse"
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Action: Receive Stock (Stock In)
  const handleReceiveStock = (recordData: Omit<StockInRecord, "id" | "createdAt">) => {
    const newRecord: StockInRecord = {
      ...recordData,
      id: `grn-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStockInHistory((prev) => [newRecord, ...prev]);

    // Update item stock counts
    setItems((prev) =>
      prev.map((it) => {
        const matching = recordData.items.find((r) => r.itemId === it.id);
        if (matching) {
          const newStock = it.currentStock + matching.quantity;
          const newStatus: "In Stock" | "Low Stock" | "Out of Stock" =
            newStock <= it.minimumStock ? "Low Stock" : "In Stock";
          return {
            ...it,
            currentStock: newStock,
            availableStock: newStock - it.reservedStock,
            status: newStatus,
            lastUpdated: "Just now"
          };
        }
        return it;
      })
    );

    // Add activity
    const newAct: ActivityLogModel = {
      id: `act-${Date.now()}`,
      type: "received",
      title: `Stock Received ${newRecord.grnNumber}`,
      referenceNo: newRecord.grnNumber,
      timestamp: "Just now",
      details: `Received ${newRecord.items.reduce((s, i) => s + i.quantity, 0)} units from ${newRecord.supplierName}`,
      date: newRecord.date,
      time: "Just now",
      user: newRecord.receivedBy,
      warehouse: newRecord.warehouseName
    };
    setActivities((prev) => [newAct, ...prev]);
    alert(`GRN ${newRecord.grnNumber} generated successfully! Stock counts updated.`);
  };

  // Action: Issue Stock (Stock Out)
  const handleIssueStock = (recordData: Omit<StockOutRecord, "id" | "createdAt">) => {
    const newRecord: StockOutRecord = {
      ...recordData,
      id: `so-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStockOutHistory((prev) => [newRecord, ...prev]);

    // Deduct stock counts
    setItems((prev) =>
      prev.map((it) => {
        const matching = recordData.items.find((r) => r.itemId === it.id);
        if (matching) {
          const newStock = Math.max(0, it.currentStock - matching.quantity);
          const newStatus: "In Stock" | "Low Stock" | "Out of Stock" =
            newStock === 0 ? "Out of Stock" : newStock <= it.minimumStock ? "Low Stock" : "In Stock";
          return {
            ...it,
            currentStock: newStock,
            availableStock: Math.max(0, newStock - it.reservedStock),
            status: newStatus,
            lastUpdated: "Just now"
          };
        }
        return it;
      })
    );

    // Add activity
    const newAct: ActivityLogModel = {
      id: `act-${Date.now()}`,
      type: "issued",
      title: `Stock Issued ${newRecord.soNumber}`,
      referenceNo: newRecord.soNumber,
      timestamp: "Just now",
      details: `Dispatched to ${newRecord.customerOrDept} (${newRecord.items.reduce((s, i) => s + i.quantity, 0)} units)`,
      date: newRecord.date,
      time: "Just now",
      user: newRecord.issuedBy,
      warehouse: newRecord.warehouseName
    };
    setActivities((prev) => [newAct, ...prev]);
    alert(`Stock dispatch ${newRecord.soNumber} completed successfully!`);
  };

  // Action: Add Transfer
  const handleAddTransfer = (recordData: Omit<StockTransferRecord, "id">) => {
    const newTransfer: StockTransferRecord = {
      ...recordData,
      id: `tr-${Date.now()}`
    };
    setTransfers((prev) => [newTransfer, ...prev]);

    const newAct: ActivityLogModel = {
      id: `act-${Date.now()}`,
      type: "transfer",
      title: `Stock Transfer ${newTransfer.transferNumber}`,
      referenceNo: newTransfer.transferNumber,
      timestamp: "Just now",
      details: `${newTransfer.fromWarehouseName} ➔ ${newTransfer.toWarehouseName} (${newTransfer.items.length} SKUs)`,
      date: newTransfer.date,
      time: "Just now",
      user: newTransfer.transferredBy,
      warehouse: newTransfer.fromWarehouseName
    };
    setActivities((prev) => [newAct, ...prev]);
    alert(`Transfer ${newTransfer.transferNumber} executed!`);
  };

  // Reset to default
  const handleResetDemoData = () => {
    localStorage.removeItem("inventory_service_items_v2");
    localStorage.removeItem("inventory_service_warehouses_v2");
    localStorage.removeItem("inventory_service_suppliers_v2");
    localStorage.removeItem("inventory_service_stock_in_v2");
    localStorage.removeItem("inventory_service_stock_out_v2");
    localStorage.removeItem("inventory_service_transfers_v2");
    localStorage.removeItem("inventory_service_activities_v2");

    setItems(INITIAL_ITEMS);
    setWarehouses(INITIAL_WAREHOUSES);
    setSuppliers(INITIAL_SUPPLIERS);
    setStockInHistory(INITIAL_STOCK_IN);
    setStockOutHistory(INITIAL_STOCK_OUT);
    setTransfers(INITIAL_TRANSFERS);
    setActivities(INITIAL_ACTIVITY_LOGS);
    alert("Reset complete! Default demo inventory state loaded.");
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      items,
      warehouses,
      suppliers,
      stockInHistory,
      stockOutHistory,
      transfers,
      activities,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (data: any) => {
    if (data.items && Array.isArray(data.items)) {
      setItems(data.items);
    }
    if (data.warehouses && Array.isArray(data.warehouses)) {
      setWarehouses(data.warehouses);
    }
    if (data.suppliers && Array.isArray(data.suppliers)) {
      setSuppliers(data.suppliers);
    }
    alert("Backup data restored successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-900 pb-16 font-sans">
      {/* 1. TOP HEADER COMPONENT */}
      <InventoryHeader
        currentTab={activeTab}
        warehouses={warehouses}
        selectedWarehouseId={selectedWarehouseId}
        onSelectWarehouse={setSelectedWarehouseId}
        onNavigate={setActiveTab}
        onOpenAddModal={(type) => {
          setActiveModalItem(null);
          setModalType(type);
        }}
        onExportPdf={() => window.print()}
        onOpenScanner={() => setModalType("scan")}
        onBack={onBack}
        lowStockCount={lowStockItems.length}
      />

      {/* 2. HORIZONTAL SCROLLING NAV MENU */}
      <InventoryNavScroll
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "item_details") {
            setSelectedItem(null);
          }
        }}
        lowStockCount={lowStockItems.length}
      />

      {/* 3. MAIN SECTION CONTAINER */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <ScreenOverview
            items={displayedItems}
            warehouses={warehouses}
            activities={activities}
            categories={INITIAL_CATEGORIES}
            selectedWarehouseId={selectedWarehouseId}
            onNavigate={setActiveTab}
            onOpenAddModal={(type) => {
              setActiveModalItem(null);
              setModalType(type);
            }}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setActiveTab("item_details");
            }}
          />
        )}

        {/* TAB 2: ALL ITEMS CATALOG */}
        {activeTab === "items" && (
          <ScreenItems
            items={displayedItems}
            categories={INITIAL_CATEGORIES}
            onSelectItem={(item) => {
              setSelectedItem(item);
              setActiveTab("item_details");
            }}
            onOpenAddModal={(type) => {
              setActiveModalItem(null);
              setModalType(type);
            }}
            onOpenBarcode={(item) => {
              setActiveModalItem(item);
              setModalType("barcode");
            }}
            onDelete={(id) => {
              setItems((prev) => prev.filter((i) => i.id !== id));
            }}
          />
        )}

        {/* TAB 3: SINGLE ITEM DETAILS VIEW */}
        {activeTab === "item_details" && (
          <ScreenItemDetails
            item={selectedItem || displayedItems[0] || INITIAL_ITEMS[0]}
            onBack={() => setActiveTab("items")}
            onOpenEditModal={(item) => {
              setActiveModalItem(item);
              setModalType("edit_item");
            }}
            onOpenAdjustModal={(item) => {
              setActiveModalItem(item);
              setModalType("adjust_stock");
            }}
            onOpenBarcode={(item) => {
              setActiveModalItem(item);
              setModalType("barcode");
            }}
            onStockIn={() => {
              setActiveTab("stock_in");
            }}
            onStockOut={() => {
              setActiveTab("stock_out");
            }}
            onDelete={(id) => {
              setItems((prev) => prev.filter((i) => i.id !== id));
            }}
          />
        )}

        {/* TAB 4: RECEIVE STOCK (STOCK IN / GRN) */}
        {activeTab === "stock_in" && (
          <ScreenStockIn
            items={items}
            suppliers={suppliers}
            warehouses={warehouses}
            stockInHistory={stockInHistory}
            onReceiveStock={handleReceiveStock}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {/* TAB 5: ISSUE STOCK (STOCK OUT / SALES DISPATCH) */}
        {activeTab === "stock_out" && (
          <ScreenStockOut
            items={items}
            warehouses={warehouses}
            stockOutHistory={stockOutHistory}
            onIssueStock={handleIssueStock}
          />
        )}

        {/* TAB 6: WAREHOUSES & LOCATIONS */}
        {activeTab === "warehouses" && (
          <ScreenWarehouses
            warehouses={warehouses}
            onSelectWarehouse={(id) => setSelectedWarehouseId(id)}
            onNavigate={setActiveTab}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {/* TAB 7: STOCK TAKE & PHYSICAL COUNT AUDIT */}
        {activeTab === "stock_take" && (
          <ScreenStockTake
            warehouses={warehouses}
            items={items}
            currentStockTake={stockTake}
          />
        )}

        {/* TAB 8: REPORTS & ANALYTICS */}
        {activeTab === "reports" && (
          <ScreenReportsAnalytics
            items={items}
            onExportPdf={() => {
              window.print();
            }}
          />
        )}

        {/* TAB 9: LOW STOCK ALERTS */}
        {activeTab === "alerts" && (
          <ScreenLowStockAlerts
            items={items}
            onNavigate={setActiveTab}
            onStockInItem={(item) => {
              setActiveTab("stock_in");
            }}
          />
        )}

        {/* TAB 10: SUPPLIERS CATALOG */}
        {activeTab === "suppliers" && (
          <ScreenSuppliers
            suppliers={suppliers}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {/* TAB 11: INTER-WAREHOUSE TRANSFERS */}
        {activeTab === "transfers" && (
          <ScreenTransfers
            warehouses={warehouses}
            items={items}
            transfers={transfers}
            onAddTransfer={handleAddTransfer}
          />
        )}

        {/* TAB 12: AUDIT ACTIVITY LOG */}
        {activeTab === "activity_log" && (
          <ScreenActivityLog activities={activities} />
        )}

        {/* TAB 13: SYSTEM SETTINGS & PREFERENCES */}
        {activeTab === "settings" && (
          <ScreenSettings
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* 4. MODALS CONTAINER */}
      <InventoryModals
        modalType={modalType}
        activeItem={activeModalItem}
        categories={INITIAL_CATEGORIES}
        warehouses={warehouses}
        suppliers={suppliers}
        onClose={() => {
          setModalType(null);
          setActiveModalItem(null);
        }}
        onSaveItem={handleSaveItem}
        onAdjustStock={handleAdjustStock}
        onSaveWarehouse={(data) => {
          const newWh: WarehouseModel = {
            id: `wh-${Date.now()}`,
            name: data.name || "New Warehouse",
            code: `WH-${Math.floor(10 + Math.random() * 90)}`,
            location: data.location || "Pokhara, Nepal",
            branch: data.branch || "Hub",
            manager: "Store Manager",
            contact: "+977 9800000000",
            totalSkuCount: 0,
            capacityUsedPercent: 10,
            status: "Active",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
          };
          setWarehouses((prev) => [...prev, newWh]);
        }}
        onSaveSupplier={(data) => {
          const newSup: SupplierModel = {
            id: `sup-${Date.now()}`,
            name: data.name || "New Supplier",
            contactPerson: "Sales Rep",
            email: "supplier@care2care.np",
            location: data.location || "Nepal",
            phone: data.phone || "+977 9800000000",
            rating: 4.8,
            reviewCount: 1,
            categories: data.categories || ["General Hardware"],
            paymentTerms: "Net 30 Days",
            activeOrdersCount: 0
          };
          setSuppliers((prev) => [...prev, newSup]);
        }}
      />
    </div>
  );
};
