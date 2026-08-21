import React, { useState, useEffect } from "react";
import { StoreTab, ProductItem, StoreOrder, StockTransaction, CouponItem, StoreProfileModel, OrderStatus } from "./store/types";
import { INITIAL_STORE_PROFILE, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_STOCK_TRANSACTIONS, INITIAL_COUPONS } from "./store/mockData";
import { StoreHeader } from "./store/StoreHeader";
import { StoreNavScroll } from "./store/StoreNavScroll";
import { ScreenStoreWizard } from "./store/ScreenStoreWizard";
import { ScreenInventoryOverview } from "./store/ScreenInventoryOverview";
import { ScreenProducts } from "./store/ScreenProducts";
import { ScreenProductDetails } from "./store/ScreenProductDetails";
import { ScreenStockIn } from "./store/ScreenStockIn";
import { ScreenStockOut } from "./store/ScreenStockOut";
import { ScreenOrders } from "./store/ScreenOrders";
import { ScreenOrderDetails } from "./store/ScreenOrderDetails";
import { ScreenCoupons } from "./store/ScreenCoupons";
import { ScreenAnalytics } from "./store/ScreenAnalytics";
import { ScreenReturnsRefunds } from "./store/ScreenReturnsRefunds";
import { ScreenPayouts } from "./store/ScreenPayouts";
import { ScreenCustomers } from "./store/ScreenCustomers";
import { ScreenInventoryAlerts } from "./store/ScreenInventoryAlerts";
import { ScreenShippingSettings } from "./store/ScreenShippingSettings";
import { ScreenStorefrontPreview } from "./store/ScreenStorefrontPreview";
import { AddProductModal } from "./store/AddProductModal";

interface CustomStoreServiceProps {
  onBack?: () => void;
}

export const CustomStoreService: React.FC<CustomStoreServiceProps> = ({ onBack }) => {
  // 1. Core State with Local Storage persistence
  const [storeProfile, setStoreProfile] = useState<StoreProfileModel>(() => {
    const saved = localStorage.getItem("care2care_store_profile");
    return saved ? JSON.parse(saved) : INITIAL_STORE_PROFILE;
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem("care2care_store_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    const saved = localStorage.getItem("care2care_store_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<StockTransaction[]>(() => {
    const saved = localStorage.getItem("care2care_store_transactions");
    return saved ? JSON.parse(saved) : INITIAL_STOCK_TRANSACTIONS;
  });

  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    const saved = localStorage.getItem("care2care_store_coupons");
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Navigation & Selection states
  const [currentTab, setCurrentTab] = useState<StoreTab>("inventory_overview");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(products[0] || null);
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(orders[0] || null);

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // 2. Local Storage Sync
  useEffect(() => {
    localStorage.setItem("care2care_store_profile", JSON.stringify(storeProfile));
  }, [storeProfile]);

  useEffect(() => {
    localStorage.setItem("care2care_store_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("care2care_store_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("care2care_store_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("care2care_store_coupons", JSON.stringify(coupons));
  }, [coupons]);

  // 3. Computed stats
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.totalAmount, 0) + 245000;

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockLevel).length;
  const processingOrdersCount = orders.filter((o) => o.status === "Processing").length;

  // 4. Mutation Handlers
  const handleUpdateProfile = (updated: Partial<StoreProfileModel>) => {
    setStoreProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveProduct = (product: ProductItem) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    setSelectedProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(products[0] || null);
    }
  };

  const handleReceiveStock = (
    newTransaction: StockTransaction,
    updatedProducts: { id: string; qty: number }[]
  ) => {
    setTransactions((prev) => [newTransaction, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        const update = updatedProducts.find((u) => u.id === p.id);
        if (update) {
          const newStock = p.stock + update.qty;
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? "Out of Stock" : newStock <= p.minStockLevel ? "Low Stock" : "In Stock"
          };
        }
        return p;
      })
    );
  };

  const handleIssueStock = (
    newTransaction: StockTransaction,
    updatedProducts: { id: string; qty: number }[]
  ) => {
    setTransactions((prev) => [newTransaction, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        const update = updatedProducts.find((u) => u.id === p.id);
        if (update) {
          const newStock = Math.max(0, p.stock - update.qty);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? "Out of Stock" : newStock <= p.minStockLevel ? "Low Stock" : "In Stock"
          };
        }
        return p;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleCreateCoupon = (newCoupon: CouponItem) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId
          ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
          : c
      )
    );
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  const handlePlaceCustomerOrder = (
    order: StoreOrder,
    deductions: { id: string; qty: number }[]
  ) => {
    setOrders((prev) => [order, ...prev]);
    setSelectedOrder(order);

    // Decrement stocks
    setProducts((prev) =>
      prev.map((p) => {
        const d = deductions.find((item) => item.id === p.id);
        if (d) {
          const newStock = Math.max(0, p.stock - d.qty);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? "Out of Stock" : newStock <= p.minStockLevel ? "Low Stock" : "In Stock"
          };
        }
        return p;
      })
    );

    // Record Stock Out transaction
    const tx: StockTransaction = {
      id: `tx-order-${order.id}`,
      type: "Issue",
      refNo: `GIN-${order.orderNumber}`,
      date: order.date,
      time: order.time,
      partyName: `${order.customerName} (Online Order)`,
      warehouse: "Main Warehouse (Lazimpat)",
      totalItems: order.items.reduce((acc, i) => acc + i.quantity, 0),
      items: order.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity
      })),
      status: "Completed"
    };

    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-800 font-sans pb-16">
      {/* 1. Sticky Store Header */}
      <StoreHeader
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        storeProfile={storeProfile}
        totalRevenue={totalRevenue}
        lowStockCount={lowStockCount}
        processingOrdersCount={processingOrdersCount}
        onOpenAddProductModal={() => {
          setEditingProduct(null);
          setShowAddProductModal(true);
        }}
        onBack={onBack}
      />

      {/* 2. Sticky Horizontal 16-Tab NavScroll */}
      <StoreNavScroll
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        processingOrdersCount={processingOrdersCount}
        lowStockCount={lowStockCount}
        pendingReturnsCount={1}
      />

      {/* 3. Screen View Router */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {currentTab === "store_setup" && (
          <ScreenStoreWizard
            profile={storeProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "inventory_overview" && (
          <ScreenInventoryOverview
            products={products}
            transactions={transactions}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "products" && (
          <ScreenProducts
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setShowAddProductModal(true);
            }}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setShowAddProductModal(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "product_details" && (
          <ScreenProductDetails
            product={selectedProduct}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setShowAddProductModal(true);
            }}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "stock_in" && (
          <ScreenStockIn
            products={products}
            transactions={transactions}
            onReceiveStock={handleReceiveStock}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "stock_out" && (
          <ScreenStockOut
            products={products}
            transactions={transactions}
            onIssueStock={handleIssueStock}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "orders" && (
          <ScreenOrders
            orders={orders}
            onSelectOrder={(o) => setSelectedOrder(o)}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "order_details" && (
          <ScreenOrderDetails
            order={selectedOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "coupons" && (
          <ScreenCoupons
            coupons={coupons}
            onCreateCoupon={handleCreateCoupon}
            onToggleCoupon={handleToggleCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "analytics" && (
          <ScreenAnalytics
            products={products}
            orders={orders}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "returns_refunds" && (
          <ScreenReturnsRefunds onNavigate={setCurrentTab} />
        )}

        {currentTab === "payouts" && (
          <ScreenPayouts
            storeProfile={storeProfile}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "customers" && (
          <ScreenCustomers onNavigate={setCurrentTab} />
        )}

        {currentTab === "inventory_alerts" && (
          <ScreenInventoryAlerts
            products={products}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "shipping_settings" && (
          <ScreenShippingSettings
            storeProfile={storeProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === "storefront_preview" && (
          <ScreenStorefrontPreview
            storeProfile={storeProfile}
            products={products}
            coupons={coupons}
            onPlaceCustomerOrder={handlePlaceCustomerOrder}
            onNavigate={setCurrentTab}
          />
        )}
      </main>

      {/* 4. Add/Edit Product Modal */}
      {showAddProductModal && (
        <AddProductModal
          initialProduct={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowAddProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
export default CustomStoreService;
