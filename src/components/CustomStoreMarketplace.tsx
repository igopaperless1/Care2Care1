import React, { useState, useMemo } from "react";
import { MarketplaceWizard } from "./MarketplaceWizard";
import {
  ShoppingBag,
  Store as StoreIcon,
  Plus,
  Search,
  Package,
  DollarSign,
  Users,
  Star,
  Settings,
  CreditCard,
  Truck,
  Tag,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  ShieldCheck,
  Sparkles,
  Key,
  Globe,
  Phone,
  Mail,
  MapPin,
  X,
  FileText,
  Percent,
  Check,
  AlertCircle,
  Building2,
  ShoppingCart,
  Upload,
  ExternalLink,
  Layers,
  Award,
  Crown
} from "lucide-react";

// Safe access helper functions as mandated
export const safeStr = (val: any, fallback = ""): string =>
  val && typeof val === "string" ? val : fallback;
export const safeNum = (val: any, fallback = 0): number =>
  val !== null && val !== undefined && !isNaN(Number(val)) ? Number(val) : fallback;
export const safeDate = (val: any): string => {
  try {
    return val ? new Date(val).toLocaleDateString() : new Date().toLocaleDateString();
  } catch {
    return new Date().toLocaleDateString();
  }
};

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export interface StoreProfile {
  id: string;
  userId: string;
  storeName: string;
  storeLogo: string;
  storeBanner: string;
  profilePictureUrl?: string;
  description: string;
  category: "physical" | "digital" | "service" | "creative" | "educational" | "custom";
  address: string;
  city: string;
  country: string;
  locationCoordinates?: string;
  phone: string;
  email: string;
  website: string;
  // Official Tax & Registration Fillers
  vatPanNumber?: string;
  socialSecurityNumber?: string;
  officeRegistrationNumber?: string;
  registrationDocUrl?: string;
  // Payment Gateway Configs
  esewaMerchantId?: string;
  khaltiPublicKey?: string;
  fonepayMerchantCode?: string;
  bankAccountDetails?: string;
  stripePublicKey?: string;
  enableCOD?: boolean;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  plan: "Free" | "Basic" | "Pro" | "Enterprise";
  createdAt: string;

  // Go Paperless Marketplace Setup Wizard Fields
  tagline?: string;
  brandColor?: string;
  proprietorName?: string;
  proprietorDob?: string;
  businessType?: string;
  bankName?: string;
  bankAccountNumber?: string;
  branchCode?: string;
  accountHolderName?: string;
  currency?: string;
  payoutFrequency?: string;
  bankVerificationStatus?: "verified" | "pending";
  businessHours?: string;
  fixedChargeDeliveryEnabled?: boolean;
  fixedDeliveryCharge?: number;
  freeDeliveryThresholdEnabled?: boolean;
  freeDeliveryThreshold?: number;
  localPickupAvailable?: boolean;
  pickupInstructions?: string;
  subdomain?: string;
  customDomain?: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  options: string[];
  price: number;
  quantity: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: string;
  type: "physical" | "digital" | "service";
  price: number;
  comparePrice: number;
  costPrice: number;
  currency: string;
  images: string[];
  sku: string;
  quantity: number;
  minQuantity: number;
  isInStock: boolean;
  isDigital: boolean;
  downloadFile?: string;
  licenseKey?: string;
  deliveryType: "instant" | "manual" | "scheduled";
  variations: ProductVariation[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variation?: string;
  quantity: number;
  price: number;
  total: number;
  isDigital: boolean;
  downloadLink?: string;
  licenseKey?: string;
}

export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface OrderRecord {
  id: string;
  storeId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "khalti" | "esewa" | "paddle" | "bank" | "cod";
  paymentTransactionId?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  usedCount: number;
  usageLimit: number;
  isActive: boolean;
}

interface Props {
  onBackToServices?: () => void;
}

// ==========================================
// DEFAULT MOCK STORE DATA
// ==========================================
const DEFAULT_STORE: StoreProfile = {
  id: "store-care2care-01",
  userId: "user-101",
  storeName: "Care2Care Health & Wellness Marketplace",
  storeLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80",
  storeBanner: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80",
  profilePictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  description: "Official Care2Care store supplying verified medical equipment, wellness guides, digital caregiver SOPs, and home health consultation services.",
  category: "physical",
  address: "108 Lazimpat, Durbar Marg",
  city: "Kathmandu",
  country: "Nepal",
  locationCoordinates: "27.7172° N, 85.3240° E (Central Hub)",
  phone: "+977 1 4410992",
  email: "store@care2care.org",
  website: "https://care2care.org/store",
  vatPanNumber: "PAN-609812341",
  socialSecurityNumber: "SSF-2081-88910",
  officeRegistrationNumber: "REG-2080/19283-KTM",
  registrationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  esewaMerchantId: "ESEWA_LIVE_908123",
  khaltiPublicKey: "khalti_live_secret_key_889123",
  fonepayMerchantCode: "FONEPAY_MCH_4401",
  bankAccountDetails: "Nabil Bank Ltd, A/C: 01001017500129, Branch: Durbar Marg",
  enableCOD: true,
  isActive: true,
  isVerified: true,
  rating: 4.9,
  reviewCount: 38,
  plan: "Pro",
  createdAt: "2026-01-15",
  tagline: "Verified Medical Equipment, Caregiver Tools & Digital SOPs",
  brandColor: "#2E7D32",
  proprietorName: "Dr. Rajesh Sharma",
  proprietorDob: "1982-05-14",
  businessType: "Private Limited Company (Pvt. Ltd.)",
  bankName: "Nabil Bank Ltd.",
  bankAccountNumber: "01001017500129",
  branchCode: "NABIL-001-KTM",
  accountHolderName: "Care2Care Health Solutions Pvt. Ltd.",
  currency: "NPR (Rs.)",
  payoutFrequency: "Weekly (Every Friday)",
  bankVerificationStatus: "verified",
  businessHours: "Mon-Sat: 8:00 AM - 8:00 PM (Emergency 24/7)",
  fixedChargeDeliveryEnabled: true,
  fixedDeliveryCharge: 150,
  freeDeliveryThresholdEnabled: true,
  freeDeliveryThreshold: 5000,
  localPickupAvailable: true,
  pickupInstructions: "Collect from Lazimpat Central Pharmacy Hub with Order ID & OTP verification.",
  subdomain: "health-hub",
  customDomain: "store.care2care.org"
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "prod-shoes-1",
    storeId: "store-care2care-01",
    name: "Orthopedic Comfort Walking Shoes (Slip-Resistant)",
    description: "Breathable mesh orthopedic shoes with shock-absorbing air cushioning, memory foam insoles, and easy velcro straps designed for seniors & nurses.",
    category: "Shoes & Footwear",
    type: "physical",
    price: 3800,
    comparePrice: 4800,
    costPrice: 2400,
    currency: "NPR",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"],
    sku: "SHOE-ORTHO-01",
    quantity: 40,
    minQuantity: 5,
    isInStock: true,
    isDigital: false,
    deliveryType: "manual",
    variations: [
      { id: "v-s1", name: "Size EU 38 / US 7 (Black)", options: ["Black"], price: 3800, quantity: 15, sku: "SHOE-38" },
      { id: "v-s2", name: "Size EU 40 / US 8.5 (Navy Blue)", options: ["Navy Blue"], price: 3800, quantity: 15, sku: "SHOE-40" },
      { id: "v-s3", name: "Size EU 42 / US 10 (Grey)", options: ["Grey"], price: 3800, quantity: 10, sku: "SHOE-42" }
    ],
    rating: 4.9,
    reviewCount: 34,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-12"
  },
  {
    id: "prod-tshirt-1",
    storeId: "store-care2care-01",
    name: "Caregiver Uniform Crew-Neck T-Shirt (100% Organic Cotton)",
    description: "Ultra-soft antimicrobial breathable cotton T-Shirt with reinforced double stitching, front utility pocket, and quick-dry moisture wicking.",
    category: "Apparel / T-Shirt",
    type: "physical",
    price: 1200,
    comparePrice: 1600,
    costPrice: 600,
    currency: "NPR",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80"],
    sku: "APP-TSHIRT-01",
    quantity: 85,
    minQuantity: 10,
    isInStock: true,
    isDigital: false,
    deliveryType: "manual",
    variations: [
      { id: "v-ts1", name: "Size S (Medical Green)", options: ["Emerald Green"], price: 1200, quantity: 25, sku: "TSHIRT-S" },
      { id: "v-ts2", name: "Size M (Navy Blue)", options: ["Navy"], price: 1200, quantity: 30, sku: "TSHIRT-M" },
      { id: "v-ts3", name: "Size L (Slate White)", options: ["White"], price: 1200, quantity: 30, sku: "TSHIRT-L" }
    ],
    rating: 4.8,
    reviewCount: 28,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-10"
  },
  {
    id: "prod-pants-1",
    storeId: "store-care2care-01",
    name: "Flexi-Stretch Scrub Trousers & Caregiver Pants",
    description: "Multi-pocket elastic waistband scrub pants engineered for maximum stretch, spill-resistance, and all-day movement during nursing shifts.",
    category: "Apparel / Pants",
    type: "physical",
    price: 2200,
    comparePrice: 2800,
    costPrice: 1100,
    currency: "NPR",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80"],
    sku: "APP-PANTS-01",
    quantity: 50,
    minQuantity: 5,
    isInStock: true,
    isDigital: false,
    deliveryType: "manual",
    variations: [
      { id: "v-p1", name: "Size Medium (Navy)", options: ["Navy Blue"], price: 2200, quantity: 25, sku: "PANTS-M" },
      { id: "v-p2", name: "Size Large (Black)", options: ["Black"], price: 2200, quantity: 25, sku: "PANTS-L" }
    ],
    rating: 4.9,
    reviewCount: 19,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-08"
  },
  {
    id: "prod-1",
    storeId: "store-care2care-01",
    name: "Digital Blood Pressure Monitor Pro (Bluetooth)",
    description: "Clinical grade digital BP monitor with automatic cuff inflation, arrhythmia detection, and Bluetooth sync to Care2Care Vitals App.",
    category: "Medical Devices",
    type: "physical",
    price: 4500,
    comparePrice: 5500,
    costPrice: 3200,
    currency: "NPR",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80"],
    sku: "MED-BP-900",
    quantity: 35,
    minQuantity: 5,
    isInStock: true,
    isDigital: false,
    deliveryType: "manual",
    variations: [
      { id: "v1", name: "Standard Cuff (22-32cm)", options: ["White"], price: 4500, quantity: 20, sku: "BP-STD" },
      { id: "v2", name: "Large XL Cuff (32-42cm)", options: ["White"], price: 4900, quantity: 15, sku: "BP-XL" }
    ],
    rating: 4.9,
    reviewCount: 22,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-01"
  },
  {
    id: "prod-2",
    storeId: "store-care2care-01",
    name: "Complete Senior Caregiver Training Manual (PDF + Videos)",
    description: "Interactive e-book, printable caregiving worksheets, post-op rehabilitation checklists, and 12 instructional HD video downloads.",
    category: "Digital Courses",
    type: "digital",
    price: 1800,
    comparePrice: 2500,
    costPrice: 0,
    currency: "NPR",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"],
    sku: "DIG-SOP-2026",
    quantity: 999,
    minQuantity: 0,
    isInStock: true,
    isDigital: true,
    downloadFile: "https://care2care.org/downloads/Caregiver_Master_SOP_2026.pdf",
    licenseKey: "C2C-LIFETIME-LIC-8891",
    deliveryType: "instant",
    variations: [],
    rating: 5.0,
    reviewCount: 14,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-05"
  },
  {
    id: "prod-3",
    storeId: "store-care2care-01",
    name: "1-on-1 Virtual Nursing & Health Consultation (60 Mins)",
    description: "Live telehealth video consultation with a certified senior registered nurse to evaluate medical charts, medication reminders, and home safety.",
    category: "Health Services",
    type: "service",
    price: 2500,
    comparePrice: 3000,
    costPrice: 1000,
    currency: "NPR",
    images: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80"],
    sku: "SRV-NURSE-60M",
    quantity: 50,
    minQuantity: 2,
    isInStock: true,
    isDigital: false,
    deliveryType: "scheduled",
    variations: [],
    rating: 4.8,
    reviewCount: 19,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-10"
  }
];

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    id: "ord-101",
    storeId: "store-care2care-01",
    orderNumber: "ORD-2026-8801",
    customerName: "Ramesh Sharma",
    customerEmail: "ramesh.sharma@gmail.com",
    items: [
      {
        id: "oi-1",
        productId: "prod-1",
        productName: "Digital Blood Pressure Monitor Pro",
        quantity: 1,
        price: 4500,
        total: 4500,
        isDigital: false
      }
    ],
    subtotal: 4500,
    discount: 500,
    shippingCost: 150,
    tax: 0,
    total: 4150,
    currency: "NPR",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "esewa",
    paymentTransactionId: "ESEWA-TXN-99102",
    shippingAddress: {
      name: "Ramesh Sharma",
      phone: "+977 9841223344",
      addressLine1: "House 45, Naya Baneshwor",
      city: "Kathmandu",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44600"
    },
    trackingNumber: "NPL-EXP-889102",
    createdAt: "2026-08-04"
  },
  {
    id: "ord-102",
    storeId: "store-care2care-01",
    orderNumber: "ORD-2026-8802",
    customerName: "Sita Adhikari",
    customerEmail: "sita.a@yahoo.com",
    items: [
      {
        id: "oi-2",
        productId: "prod-2",
        productName: "Complete Senior Caregiver Training Manual",
        quantity: 1,
        price: 1800,
        total: 1800,
        isDigital: true,
        downloadLink: "https://care2care.org/downloads/Caregiver_Master_SOP_2026.pdf",
        licenseKey: "C2C-LIFETIME-LIC-8891"
      }
    ],
    subtotal: 1800,
    discount: 0,
    shippingCost: 0,
    tax: 0,
    total: 1800,
    currency: "NPR",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "khalti",
    paymentTransactionId: "KHALTI-TXN-77112",
    shippingAddress: {
      name: "Sita Adhikari",
      phone: "+977 9801998877",
      addressLine1: "Pulchowk Road, Ward 3",
      city: "Lalitpur",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44700"
    },
    createdAt: "2026-08-06"
  }
];

const DEFAULT_COUPONS: CouponRecord[] = [
  {
    id: "c-1",
    code: "CARE500",
    type: "fixed",
    value: 500,
    minOrder: 3000,
    usedCount: 14,
    usageLimit: 100,
    isActive: true
  },
  {
    id: "c-2",
    code: "HEALTH10",
    type: "percentage",
    value: 10,
    minOrder: 1000,
    usedCount: 32,
    usageLimit: 200,
    isActive: true
  }
];

export const CustomStoreMarketplace: React.FC<Props> = ({ onBackToServices }) => {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<"storefront" | "products" | "orders" | "coupons" | "analytics" | "settings">("storefront");

  // Local Storage State Persistence
  const [store, setStore] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem("care2care_custom_store_profile");
      return saved ? JSON.parse(saved) : DEFAULT_STORE;
    } catch {
      return DEFAULT_STORE;
    }
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_custom_store_products");
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_custom_store_orders");
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<CouponRecord[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_custom_store_coupons");
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<Array<{ product: ProductItem; quantity: number; selectedVariation?: string }>>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponRecord | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);
  const [selectedOrderInspect, setSelectedOrderInspect] = useState<OrderRecord | null>(null);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Persistence helpers
  const saveProducts = (data: ProductItem[]) => {
    setProducts(data);
    localStorage.setItem("care2care_custom_store_products", JSON.stringify(data));
  };

  const saveOrders = (data: OrderRecord[]) => {
    setOrders(data);
    localStorage.setItem("care2care_custom_store_orders", JSON.stringify(data));
  };

  const saveStore = (data: StoreProfile) => {
    setStore(data);
    localStorage.setItem("care2care_custom_store_profile", JSON.stringify(data));
  };

  const saveCoupons = (data: CouponRecord[]) => {
    setCoupons(data);
    localStorage.setItem("care2care_custom_store_coupons", JSON.stringify(data));
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + safeNum(item.product.price) * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.type === "fixed") return appliedCoupon.value;
    return Math.round((cartSubtotal * appliedCoupon.value) / 100);
  }, [cartSubtotal, appliedCoupon]);

  const shippingCost = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const hasPhysical = cartItems.some((i) => i.product.type === "physical");
    return hasPhysical ? 150 : 0;
  }, [cartItems]);

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  // Handlers for Cart
  const handleAddToCart = (product: ProductItem, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, quantity: qty }];
    });
    setShowCartDrawer(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any;
    });
  };

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase() && c.isActive);
    if (!found) {
      alert("Invalid or inactive coupon code!");
      return;
    }
    if (cartSubtotal < found.minOrder) {
      alert(`Minimum order requirement for this coupon is NPR ${found.minOrder}`);
      return;
    }
    setAppliedCoupon(found);
    alert(`🎉 Coupon ${found.code} applied successfully!`);
  };

  // Checkout Handler
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("Kathmandu");
  const [paymentMethod, setPaymentMethod] = useState<"khalti" | "esewa" | "paddle" | "bank" | "cod">("esewa");

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const orderItems: OrderItem[] = cartItems.map((item, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
      isDigital: item.product.isDigital,
      downloadLink: item.product.downloadFile,
      licenseKey: item.product.licenseKey
    }));

    const newOrder: OrderRecord = {
      id: "ord-" + Date.now(),
      storeId: store.id,
      orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: checkoutName || "Valued Customer",
      customerEmail: checkoutEmail || "customer@example.com",
      items: orderItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingCost,
      tax: 0,
      total: cartTotal,
      currency: "NPR",
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      paymentMethod,
      paymentTransactionId: `${paymentMethod.toUpperCase()}-TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      shippingAddress: {
        name: checkoutName,
        phone: checkoutPhone,
        addressLine1: checkoutAddress,
        city: checkoutCity,
        state: "Bagmati",
        country: "Nepal",
        postalCode: "44600"
      },
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveOrders([newOrder, ...orders]);
    setCartItems([]);
    setAppliedCoupon(null);
    setShowCheckoutModal(false);
    setShowCartDrawer(false);
    alert(`🎉 Order ${newOrder.orderNumber} placed successfully via ${paymentMethod.toUpperCase()}!`);
  };

  // Add Product Handler
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = safeStr(formData.get("name"), "New Product");
    const category = safeStr(formData.get("category"), "General");
    const type = (formData.get("type") as "physical" | "digital" | "service") || "physical";
    const price = safeNum(formData.get("price"), 500);
    const comparePrice = safeNum(formData.get("comparePrice"), 0);
    const costPrice = safeNum(formData.get("costPrice"), 0);
    const quantity = safeNum(formData.get("quantity"), 10);
    const description = safeStr(formData.get("description"), "");
    const imageUrl = safeStr(formData.get("image"), "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80");
    const downloadFile = safeStr(formData.get("downloadFile"), "");
    const licenseKey = safeStr(formData.get("licenseKey"), "");

    const newProd: ProductItem = {
      id: "prod-" + Date.now(),
      storeId: store.id,
      name,
      description,
      category,
      type,
      price,
      comparePrice,
      costPrice,
      currency: "NPR",
      images: [imageUrl],
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      quantity,
      minQuantity: 2,
      isInStock: quantity > 0,
      isDigital: type === "digital",
      downloadFile: downloadFile || undefined,
      licenseKey: licenseKey || undefined,
      deliveryType: type === "digital" ? "instant" : "manual",
      variations: [],
      rating: 5.0,
      reviewCount: 1,
      isActive: true,
      isFeatured: true,
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveProducts([newProd, ...products]);
    setShowAddProductModal(false);
  };

  // Filtered Products for Storefront & Product Table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedTypeFilter === "all" || p.type === selectedTypeFilter;
      const matchCategory =
        selectedCategoryFilter === "all" ||
        p.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
      return matchSearch && matchType && matchCategory;
    });
  }, [products, searchQuery, selectedTypeFilter, selectedCategoryFilter]);

  // Analytics Calculation
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + (o.paymentStatus === "paid" ? o.total : 0), 0);
  }, [orders]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* BRANDING HEADER */}
      <div className="bg-gradient-to-r from-[#2E7D32] via-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-700/50 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-white/10 backdrop-blur-md text-amber-300 rounded-2xl border border-white/20 shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {store.storeName}
                </h1>
                {store.isVerified && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED STORE
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Care2Care E-Commerce Platform • Physical Goods, Digital Content & Healthcare Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onBackToServices && (
              <button
                type="button"
                onClick={onBackToServices}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer border border-white/20 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Hub</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCartDrawer(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2 border border-amber-300"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-[10px]">
                रु {cartTotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* MAIN NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-emerald-700/50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("storefront")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "storefront"
                ? "bg-white text-[#2E7D32] font-black shadow-md"
                : "text-emerald-100 hover:bg-emerald-800/50"
            }`}
          >
            <StoreIcon className="w-4 h-4" />
            <span>Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "products"
                ? "bg-white text-[#2E7D32] font-black shadow-md"
                : "text-emerald-100 hover:bg-emerald-800/50"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "orders"
                ? "bg-white text-[#2E7D32] font-black shadow-md"
                : "text-emerald-100 hover:bg-emerald-800/50"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "coupons"
                ? "bg-white text-[#2E7D32] font-black shadow-md"
                : "text-emerald-100 hover:bg-emerald-800/50"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "analytics"
                ? "bg-white text-[#2E7D32] font-black shadow-md"
                : "text-emerald-100 hover:bg-emerald-800/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "settings"
                ? "bg-white text-[#2E7D32] font-black shadow-md"
                : "text-emerald-100 hover:bg-emerald-800/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Setup Wizard</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS SUMMARY BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-[#2E7D32] rounded-xl font-black">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Products</div>
            <div className="text-base font-black text-slate-900">{products.length} Items</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-900 rounded-xl font-black">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Sales Revenue</div>
            <div className="text-base font-black text-[#2E7D32]">रु {totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl font-black">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Orders</div>
            <div className="text-base font-black text-slate-900">{orders.length} Placed</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl font-black">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Subscription Plan</div>
            <div className="text-base font-black text-amber-700">{store.plan} Plan</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: STOREFRONT VIEW (CUSTOMER BROWSE & SHOPPING) */}
      {/* ========================================================================= */}
      {activeTab === "storefront" && (
        <div className="space-y-6">
          {/* Banner Hero */}
          <div className="relative rounded-3xl overflow-hidden h-48 sm:h-64 shadow-lg border border-slate-200">
            <img src={store.storeBanner} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white">
              <div className="flex items-center gap-3">
                <img src={store.storeLogo} alt="Logo" className="w-14 h-14 rounded-2xl border-2 border-white object-cover shadow-md" />
                <div>
                  <h2 className="text-lg sm:text-xl font-black">{store.storeName}</h2>
                  <p className="text-xs text-slate-200 line-clamp-2 max-w-2xl">{store.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation Ribbon (Professional E-Commerce Category Filter) */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Browse Store Categories</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {[
                { id: "all", label: "🛍️ All Products", count: products.length },
                { id: "Shoes", label: "👟 Shoes & Footwear", count: products.filter(p => p.category.includes("Shoes")).length },
                { id: "T-Shirt", label: "👕 Apparel: T-Shirts", count: products.filter(p => p.category.includes("T-Shirt")).length },
                { id: "Pants", label: "👖 Apparel: Pants & Scrubs", count: products.filter(p => p.category.includes("Pants")).length },
                { id: "Medical", label: "🩺 Medical Devices", count: products.filter(p => p.category.includes("Medical")).length },
                { id: "Digital", label: "💻 Digital SOPs & Courses", count: products.filter(p => p.category.includes("Digital")).length },
                { id: "Services", label: "🛠️ Health Services", count: products.filter(p => p.category.includes("Services")).length },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                    selectedCategoryFilter === cat.id
                      ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm font-black scale-102"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategoryFilter === cat.id ? "bg-emerald-900 text-white" : "bg-slate-200 text-slate-800"}`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, devices, courses or virtual services..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs font-bold text-slate-500">Type:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="all">All Product Types</option>
                <option value="physical">Physical Goods 📦</option>
                <option value="digital">Digital Downloads 💻</option>
                <option value="service">Services 🛠️</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={prod.images[0] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80"}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black rounded-lg">
                        {prod.type === "physical" ? "Physical 📦" : prod.type === "digital" ? "Digital 💻" : "Service 🛠️"}
                      </span>
                      {prod.comparePrice > prod.price && (
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-md">
                          SAVE NPR {(prod.comparePrice - prod.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-extrabold text-[#2E7D32] uppercase tracking-wider">
                      {prod.category}
                    </div>
                    <h3 className="font-black text-slate-900 text-sm line-clamp-1 group-hover:text-[#2E7D32] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 font-medium">{prod.description}</p>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 pt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-slate-400 text-[10px]">({prod.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      रु {prod.price.toLocaleString()}
                    </div>
                    {prod.comparePrice > 0 && (
                      <div className="text-[10px] text-slate-400 line-through">
                        रु {prod.comparePrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod, 1)}
                    className="px-3.5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: PRODUCTS MANAGEMENT (STORE OWNER) */}
      {/* ========================================================================= */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Product Inventory & Catalog</h2>
              <p className="text-xs text-slate-500 font-medium">
                Add, edit, track stock, digital keys, and manage variations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price (NPR)</th>
                  <th className="p-3">Stock Quantity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={prod.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                        <div>
                          <div className="font-black text-slate-900">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 uppercase font-bold text-slate-600">{prod.type}</td>
                    <td className="p-3 font-black text-[#2E7D32]">रु {prod.price.toLocaleString()}</td>
                    <td className="p-3 font-bold">{prod.quantity} Units</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = products.filter((p) => p.id !== prod.id);
                          saveProducts(updated);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: STORE SETTINGS & PROFILE FILLERS (GO PAPERLESS WIZARD) */}
      {/* ========================================================================= */}
      {activeTab === "settings" && (
        <MarketplaceWizard
          store={store}
          onUpdateStore={saveStore}
          onFinish={() => setActiveTab("storefront")}
        />
      )}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2E7D32]" />
                Add New Product / Service
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Oxygen Concentrator 5L"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Type *</label>
                  <select name="type" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <option value="physical">Physical Product 📦</option>
                    <option value="digital">Digital Product 💻</option>
                    <option value="service">Healthcare Service 🛠️</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue="Medical Supplies"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (NPR) *</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={1200}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price</label>
                  <input
                    type="number"
                    name="comparePrice"
                    defaultValue={1500}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={15}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  name="image"
                  defaultValue="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Detail features, warranty, and specifications..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2E7D32] text-white font-black rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CART & CHECKOUT DRAWER / MODAL */}
      {/* ========================================================================= */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 space-y-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#2E7D32]" />
                  Your Shopping Cart ({cartItems.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 mt-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-xs text-slate-900">{item.product.name}</div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        रु {item.product.price.toLocaleString()} x {item.quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.product.id, -1)}
                        className="w-6 h-6 bg-slate-100 font-black rounded-md flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.product.id, 1)}
                        className="w-6 h-6 bg-slate-100 font-black rounded-md flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs font-medium">
                    Your cart is empty. Add products from the storefront!
                  </div>
                )}
              </div>
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 pt-3">
                {/* Coupon Code Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. CARE500)"
                    className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-amber-500 text-slate-950 text-xs font-black rounded-xl"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold">रु {cartSubtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>- रु {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping:</span>
                    <span className="font-bold">रु {shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount:</span>
                    <span className="text-[#2E7D32]">रु {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL WITH KHALTI, ESEWA, PADDLE, COD */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2E7D32]" />
                Checkout & Shipping Details
              </h3>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  placeholder="e.g. Rajesh Karki"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    placeholder="+977 9841000000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  placeholder="Street name, ward number, city"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Payment Gateway Options */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Payment Method *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("esewa")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === "esewa"
                        ? "border-emerald-600 bg-emerald-50 text-[#2E7D32]"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    eSewa 💚
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("khalti")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === "khalti"
                        ? "border-purple-600 bg-purple-50 text-purple-900"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    Khalti 💜
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === "cod"
                        ? "border-amber-600 bg-amber-50 text-amber-900"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    Cash on Delivery 📦
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm font-black text-[#2E7D32]">
                  Total: रु {cartTotal.toLocaleString()}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2E7D32] text-white font-black text-xs rounded-xl shadow-md"
                >
                  Confirm & Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
