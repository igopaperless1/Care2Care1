export type StoreTab =
  | "store_setup"
  | "inventory_overview"
  | "products"
  | "product_details"
  | "stock_in"
  | "stock_out"
  | "orders"
  | "order_details"
  | "coupons"
  | "analytics"
  | "returns_refunds"
  | "payouts"
  | "customers"
  | "inventory_alerts"
  | "shipping_settings"
  | "storefront_preview";

export type ProductCategory =
  | "Beverages"
  | "Supplements"
  | "Skincare"
  | "Digital Goods"
  | "Wellness Services"
  | "Organic Foods"
  | "Herbal & Ayurveda"
  | "Fitness Equipment";

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Digital" | "Service";
export type ProductType = "Physical" | "Digital" | "Service";

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  tagline?: string;
  category: ProductCategory;
  status: ProductStatus;
  sellingPrice: number;
  originalPrice?: number;
  stock: number;
  reorderLevel: number;
  minStockLevel: number;
  brand: string;
  weight?: string;
  image: string;
  description: string;
  createdAt: string;
  type: ProductType;
  variations?: { name: string; options: string[] }[];
  seoTitle?: string;
  seoDescription?: string;
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
}

export interface StoreProfileModel {
  storeName: string;
  storeTagline: string;
  logoUrl: string;
  bannerUrl: string;
  brandAccentColor: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  vatPanNumber: string;
  businessType: string;
  subdomain: string;
  payoutMethod: "esewa" | "khalti" | "bank" | "fonepay";
  payoutAccount: string;
  flatShippingCharge: number;
  freeShippingThreshold: number;
  enableLocalPickup: boolean;
  enableInternational: boolean;
}

export interface StockTransaction {
  id: string;
  type: "Receive" | "Issue" | "Transfer";
  refNo: string; // PO-00123 or SO-000456 or TR-00078
  date: string;
  time: string;
  partyName: string; // Supplier or Customer/Dept
  warehouse: string;
  totalItems: number;
  items: {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    receivedQty?: number;
  }[];
  status: "Completed" | "Pending";
}

export type OrderStatus = "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export interface StoreOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StoreOrder {
  id: string;
  orderNumber: string; // e.g. ORD-000125
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  time: string;
  status: OrderStatus;
  items: StoreOrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "eSewa" | "Khalti" | "Fonepay" | "Cash on Delivery" | "Card";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  trackingNumber?: string;
  deliveryPartner?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number; // e.g. 10 for 10% or 200 for NPR 200
  minOrderAmount?: number;
  minSpend?: number;
  maxDiscount?: number;
  usedCount: number;
  maxUsageLimit?: number;
  usageLimit?: number;
  validTill?: string;
  expiryDate?: string;
  isActive?: boolean;
  status?: "Active" | "Paused" | "Expired";
  description?: string;
}

export interface ReturnRequestItem {
  id: string;
  returnCode: string; // e.g. RET-00012
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  productName: string;
  productImage: string;
  refundAmount: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Refunded";
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tier: "VIP" | "Loyal" | "New Customer";
  address: string;
}

export interface InventoryAlertItem {
  id: string;
  type: "low_stock" | "out_of_stock" | "dead_stock" | "expiring_soon";
  productName: string;
  productImage: string;
  productId: string;
  sku: string;
  currentStock: number;
  message: string;
  timestamp: string;
  actionLabel: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
