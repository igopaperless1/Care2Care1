import {
  ProductItem,
  StoreProfileModel,
  StockTransaction,
  StoreOrder,
  CouponItem,
  ReturnRequestItem,
  CustomerProfile,
  InventoryAlertItem
} from "./types";

export const INITIAL_STORE_PROFILE: StoreProfileModel = {
  storeName: "Healthy Life Store",
  storeTagline: "Natural Products for a Better You",
  logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
  brandAccentColor: "#FF5A36",
  description: "Specialized in certified organic Himalayan herbal teas, botanical skincare, dietary supplements, and holistic wellness programs.",
  category: "Health & Organic Wellness",
  phone: "+977 9812345678",
  email: "care@healthylife.com.np",
  address: "Ward 3, Lazimpat Road",
  city: "Kathmandu, Nepal",
  vatPanNumber: "PAN-601294819",
  businessType: "Private Limited",
  subdomain: "healthylife.care2care.np",
  payoutMethod: "esewa",
  payoutAccount: "9812345678 (Healthy Life Store)",
  flatShippingCharge: 100,
  freeShippingThreshold: 2000,
  enableLocalPickup: true,
  enableInternational: false
};

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-001",
    sku: "TEA-001",
    name: "Organic Green Tea",
    tagline: "High-Altitude Himalayan Whole Leaf Tea",
    category: "Beverages",
    status: "In Stock",
    sellingPrice: 450,
    originalPrice: 520,
    stock: 110,
    reorderLevel: 120,
    minStockLevel: 20,
    brand: "Nature's Best",
    weight: "250 gm",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    description: "Hand-plucked orthodox green tea leaves from Ilam high gardens. Rich in polyphenols and natural antioxidants for daily vitality.",
    createdAt: "10 May 2025, 10:00 AM",
    type: "Physical",
    variations: [
      { name: "Pack Size", options: ["250g Pouch", "500g Tin Box", "1kg Bulk"] }
    ],
    seoTitle: "Buy 100% Organic Himalayan Green Tea Online Nepal",
    seoDescription: "Authentic organic Ilam green tea delivered across Nepal with free shipping over NPR 2000.",
    rating: 4.9,
    reviewCount: 38,
    salesCount: 340
  },
  {
    id: "prod-002",
    sku: "VITC-100",
    name: "Vitamin C 1000mg + Zinc",
    tagline: "Effervescent Immunity Booster Tablets",
    category: "Supplements",
    status: "Low Stock",
    sellingPrice: 650,
    originalPrice: 750,
    stock: 8,
    reorderLevel: 50,
    minStockLevel: 15,
    brand: "Nature's Best",
    weight: "20 Effervescent Tabs",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
    description: "Bio-available Vitamin C combined with Zinc and Citrus bioflavonoids to support antibody production and cellular defense.",
    createdAt: "08 May 2025, 02:15 PM",
    type: "Physical",
    rating: 4.8,
    reviewCount: 52,
    salesCount: 420
  },
  {
    id: "prod-003",
    sku: "SOAP-023",
    name: "Handmade Neem & Turmeric Soap",
    tagline: "Cold-Pressed Ayurvedic Clarifying Bar",
    category: "Skincare",
    status: "In Stock",
    sellingPrice: 320,
    originalPrice: 380,
    stock: 60,
    reorderLevel: 80,
    minStockLevel: 15,
    brand: "Nature's Best",
    weight: "125 gm",
    image: "https://images.unsplash.com/photo-1607006314144-88484ce93aa5?w=500&auto=format&fit=crop&q=80",
    description: "Pure botanical saponified coconut and olive oils infused with wild neem extracts and Kasturi turmeric for clear, radiant skin.",
    createdAt: "04 May 2025, 11:30 AM",
    type: "Physical",
    rating: 4.7,
    reviewCount: 19,
    salesCount: 180
  },
  {
    id: "prod-004",
    sku: "EBOOK-001",
    name: "Digital Ayurvedic Recipe Book",
    tagline: "50 Tridoshic Healing Meals & Drinks",
    category: "Digital Goods",
    status: "Digital",
    sellingPrice: 199,
    originalPrice: 399,
    stock: 9999,
    reorderLevel: 0,
    minStockLevel: 0,
    brand: "Care2Care Wellness",
    weight: "Instant PDF Download (15 MB)",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
    description: "Comprehensive lifestyle guide and seasonal meal recipes tailored to balance Vata, Pitta, and Kapha body constitutions.",
    createdAt: "01 May 2025, 09:00 AM",
    type: "Digital",
    rating: 5.0,
    reviewCount: 44,
    salesCount: 290
  },
  {
    id: "prod-005",
    sku: "SVC-YOGA",
    name: "Live Yoga Class (1 Hour Pass)",
    tagline: "1-on-1 Personalized Hatha / Vinyasa Session",
    category: "Wellness Services",
    status: "Service",
    sellingPrice: 800,
    originalPrice: 1000,
    stock: 25,
    reorderLevel: 5,
    minStockLevel: 2,
    brand: "Care2Care Studio",
    weight: "Live Video Booking",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=80",
    description: "Guided private yoga and pranayama breathing session with senior certified Himalayan yogic instructor.",
    createdAt: "28 Apr 2025, 04:00 PM",
    type: "Service",
    rating: 4.9,
    reviewCount: 61,
    salesCount: 110
  },
  {
    id: "prod-006",
    sku: "ASHWA-500",
    name: "Organic Ashwagandha Extract 500mg",
    tagline: "KSM-66 Full Spectrum Root Extract",
    category: "Supplements",
    status: "Out of Stock",
    sellingPrice: 850,
    originalPrice: 950,
    stock: 0,
    reorderLevel: 40,
    minStockLevel: 10,
    brand: "Nature's Best",
    weight: "60 Veggie Caps",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80",
    description: "Standardized organic adaptogen to lower stress hormones, enhance restful sleep, and boost vitality.",
    createdAt: "22 Apr 2025, 08:20 AM",
    type: "Physical",
    rating: 4.9,
    reviewCount: 78,
    salesCount: 510
  }
];

export const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: "ord-125",
    orderNumber: "ORD-000125",
    customerName: "Ramesh Shrestha",
    customerEmail: "ramesh@email.com",
    customerPhone: "+977 9812345678",
    customerAddress: "House 45, Lazimpat, Kathmandu",
    date: "15 May 2025",
    time: "10:30 AM",
    status: "Processing",
    items: [
      {
        id: "item-1",
        productId: "prod-001",
        productName: "Organic Green Tea (250gm)",
        productImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 450,
        totalPrice: 450
      },
      {
        id: "item-2",
        productId: "prod-002",
        productName: "Vitamin C 1000mg",
        productImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 650,
        totalPrice: 650
      },
      {
        id: "item-3",
        productId: "prod-003",
        productName: "Handmade Soap",
        productImage: "https://images.unsplash.com/photo-1607006314144-88484ce93aa5?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150
      }
    ],
    subtotal: 1250,
    shippingCharge: 100,
    tax: 175,
    discount: 0,
    totalAmount: 1525,
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    trackingNumber: "NCM-883910",
    deliveryPartner: "Nepal Can Move"
  },
  {
    id: "ord-124",
    orderNumber: "ORD-000124",
    customerName: "Sita Karki",
    customerEmail: "sita@email.com",
    customerPhone: "+977 9803322114",
    customerAddress: "Jhamsikhel, Lalitpur",
    date: "15 May 2025",
    time: "09:15 AM",
    status: "Shipped",
    items: [
      {
        id: "item-4",
        productId: "prod-002",
        productName: "Vitamin C 1000mg",
        productImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 650,
        totalPrice: 650
      }
    ],
    subtotal: 650,
    shippingCharge: 100,
    tax: 0,
    discount: 100,
    totalAmount: 650,
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    trackingNumber: "PTH-99201",
    deliveryPartner: "Pathao Express"
  },
  {
    id: "ord-123",
    orderNumber: "ORD-000123",
    customerName: "Aman Chaudhary",
    customerEmail: "aman@email.com",
    customerPhone: "+977 9841002233",
    customerAddress: "Baneshwor Heights, Kathmandu",
    date: "14 May 2025",
    time: "04:20 PM",
    status: "Out for Delivery",
    items: [
      {
        id: "item-5",
        productId: "prod-001",
        productName: "Organic Green Tea (250gm)",
        productImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80",
        quantity: 2,
        unitPrice: 450,
        totalPrice: 900
      },
      {
        id: "item-6",
        productId: "prod-004",
        productName: "Digital Ayurvedic Recipe Book",
        productImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 190,
        totalPrice: 190
      }
    ],
    subtotal: 1090,
    shippingCharge: 0,
    tax: 0,
    discount: 0,
    totalAmount: 1090,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    trackingNumber: "NCM-918231",
    deliveryPartner: "Nepal Can Move"
  },
  {
    id: "ord-122",
    orderNumber: "ORD-000122",
    customerName: "Priya Gurung",
    customerEmail: "priya@email.com",
    customerPhone: "+977 9860112244",
    customerAddress: "Lakeside 6, Pokhara",
    date: "14 May 2025",
    time: "11:10 AM",
    status: "Delivered",
    items: [
      {
        id: "item-7",
        productId: "prod-003",
        productName: "Handmade Neem & Turmeric Soap",
        productImage: "https://images.unsplash.com/photo-1607006314144-88484ce93aa5?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 320,
        totalPrice: 320
      }
    ],
    subtotal: 320,
    shippingCharge: 100,
    tax: 0,
    discount: 90,
    totalAmount: 330,
    paymentMethod: "Fonepay",
    paymentStatus: "Paid",
    trackingNumber: "ARX-55102",
    deliveryPartner: "Aramex"
  },
  {
    id: "ord-121",
    orderNumber: "ORD-000121",
    customerName: "Rahul Singh",
    customerEmail: "rahul@email.com",
    customerPhone: "+977 9851998877",
    customerAddress: "Thamel Marg, Kathmandu",
    date: "13 May 2025",
    time: "06:40 PM",
    status: "Cancelled",
    items: [
      {
        id: "item-8",
        productId: "prod-001",
        productName: "Organic Green Tea",
        productImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        unitPrice: 450,
        totalPrice: 450
      }
    ],
    subtotal: 450,
    shippingCharge: 0,
    tax: 0,
    discount: 0,
    totalAmount: 450,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Refunded"
  }
];

export const INITIAL_COUPONS: CouponItem[] = [
  {
    id: "cp-1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    usedCount: 45,
    maxUsageLimit: 200,
    validTill: "30 Jun 2025",
    isActive: true,
    description: "10% off for first-time store buyers"
  },
  {
    id: "cp-2",
    code: "SAVE200",
    discountType: "fixed",
    discountValue: 200,
    minOrderAmount: 1000,
    usedCount: 32,
    maxUsageLimit: 100,
    validTill: "15 Jul 2025",
    isActive: true,
    description: "Flat NPR 200 savings on orders above NPR 1,000"
  },
  {
    id: "cp-3",
    code: "SUMMER20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 800,
    usedCount: 15,
    maxUsageLimit: 150,
    validTill: "30 Jun 2025",
    isActive: true,
    description: "Summer wellness flash sale discount"
  },
  {
    id: "cp-4",
    code: "FREESHIP",
    discountType: "free_shipping",
    discountValue: 100,
    minOrderAmount: 1000,
    usedCount: 60,
    maxUsageLimit: 300,
    validTill: "31 Aug 2025",
    isActive: true,
    description: "Free express delivery nationwide across Nepal"
  }
];

export const INITIAL_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: "tx-1",
    type: "Receive",
    refNo: "PO-00123",
    date: "15 May 2025",
    time: "10:30 AM",
    partyName: "Nature's Suppliers Ltd",
    warehouse: "Main Warehouse (Lazimpat)",
    totalItems: 230,
    items: [
      { productId: "prod-001", productName: "Organic Green Tea", quantity: 100, receivedQty: 100 },
      { productId: "prod-002", productName: "Vitamin C 1000mg", quantity: 50, receivedQty: 50 },
      { productId: "prod-003", productName: "Handmade Soap", quantity: 80, receivedQty: 80 }
    ],
    status: "Completed"
  },
  {
    id: "tx-2",
    type: "Issue",
    refNo: "SO-000456",
    date: "15 May 2025",
    time: "09:15 AM",
    partyName: "Walk-in Customer / Dispatch",
    warehouse: "Main Warehouse (Lazimpat)",
    totalItems: 3,
    items: [
      { productId: "prod-001", productName: "Organic Green Tea", quantity: 2 },
      { productId: "prod-002", productName: "Vitamin C 1000mg", quantity: 1 }
    ],
    status: "Completed"
  },
  {
    id: "tx-3",
    type: "Transfer",
    refNo: "TR-00078",
    date: "14 May 2025",
    time: "04:20 PM",
    partyName: "Pokhara Branch Hub",
    warehouse: "Main Warehouse -> Pokhara Hub",
    totalItems: 45,
    items: [
      { productId: "prod-001", productName: "Organic Green Tea", quantity: 25 },
      { productId: "prod-003", productName: "Handmade Soap", quantity: 20 }
    ],
    status: "Completed"
  }
];

export const INITIAL_RETURNS: ReturnRequestItem[] = [
  {
    id: "ret-1",
    returnCode: "RET-00012",
    orderNumber: "ORD-000125",
    customerName: "Ramesh Shrestha",
    customerEmail: "ramesh@email.com",
    date: "15 May 2025",
    productName: "Organic Green Tea (250gm)",
    productImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=80",
    refundAmount: 450,
    reason: "Damaged Outer Seal during shipping",
    status: "Pending"
  },
  {
    id: "ret-2",
    returnCode: "RET-00011",
    orderNumber: "ORD-000118",
    customerName: "Sita Karki",
    customerEmail: "sita@email.com",
    date: "14 May 2025",
    productName: "Handmade Neem Soap (2 pcs)",
    productImage: "https://images.unsplash.com/photo-1607006314144-88484ce93aa5?w=150&auto=format&fit=crop&q=80",
    refundAmount: 640,
    reason: "Wrong item variant dispatched",
    status: "Approved"
  },
  {
    id: "ret-3",
    returnCode: "RET-00010",
    orderNumber: "ORD-000110",
    customerName: "Aman Chaudhary",
    customerEmail: "aman@email.com",
    date: "14 May 2025",
    productName: "Vitamin C 1000mg",
    productImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80",
    refundAmount: 650,
    reason: "Customer ordered duplicate by mistake (Product intact)",
    status: "Rejected"
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "cust-1",
    name: "Ramesh Shrestha",
    email: "ramesh@email.com",
    phone: "+977 9812345678",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    totalOrders: 5,
    totalSpent: 6250,
    lastOrderDate: "15 May 2025",
    tier: "VIP",
    address: "Lazimpat, Kathmandu"
  },
  {
    id: "cust-2",
    name: "Sita Karki",
    email: "sita@email.com",
    phone: "+977 9803322114",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    totalOrders: 3,
    totalSpent: 2150,
    lastOrderDate: "15 May 2025",
    tier: "Loyal",
    address: "Jhamsikhel, Lalitpur"
  },
  {
    id: "cust-3",
    name: "Aman Chaudhary",
    email: "aman@email.com",
    phone: "+977 9841002233",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    totalOrders: 2,
    totalSpent: 1890,
    lastOrderDate: "14 May 2025",
    tier: "New Customer",
    address: "Baneshwor, Kathmandu"
  },
  {
    id: "cust-4",
    name: "Priya Gurung",
    email: "priya@email.com",
    phone: "+977 9860112244",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    totalOrders: 4,
    totalSpent: 3420,
    lastOrderDate: "14 May 2025",
    tier: "Loyal",
    address: "Lakeside, Pokhara"
  }
];

export const INITIAL_INVENTORY_ALERTS: InventoryAlertItem[] = [
  {
    id: "alt-1",
    type: "low_stock",
    productName: "Vitamin C 1000mg",
    productImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80",
    productId: "prod-002",
    sku: "VITC-100",
    currentStock: 8,
    message: "Only 8 pcs left in Main Warehouse (below reorder level of 50 pcs)",
    timestamp: "10 mins ago",
    actionLabel: "Reorder Now"
  },
  {
    id: "alt-2",
    type: "out_of_stock",
    productName: "Organic Ashwagandha 500mg",
    productImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=80",
    productId: "prod-006",
    sku: "ASHWA-500",
    currentStock: 0,
    message: "Currently out of stock. 14 customers have clicked 'Notify Me'.",
    timestamp: "1 hour ago",
    actionLabel: "Notify Supplier"
  },
  {
    id: "alt-3",
    type: "dead_stock",
    productName: "Herbal Eucalyptus Shampoo",
    productImage: "https://images.unsplash.com/photo-1607006314144-88484ce93aa5?w=150&auto=format&fit=crop&q=80",
    productId: "prod-007",
    sku: "SHAMP-004",
    currentStock: 45,
    message: "No sales recorded in the past 60 days. Consider creating a flash bundle discount.",
    timestamp: "2 hours ago",
    actionLabel: "Create Flash Sale"
  },
  {
    id: "alt-4",
    type: "expiring_soon",
    productName: "Organic Wild Forest Honey",
    productImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150&auto=format&fit=crop&q=80",
    productId: "prod-008",
    sku: "HONY-012",
    currentStock: 18,
    message: "Batch HNY-2024 expires on 25 May 2025. Recommend clearance promotion.",
    timestamp: "3 hours ago",
    actionLabel: "Mark Clearance"
  }
];

export const ANALYTICS_DATA = {
  totalRevenue: 245000,
  revenueGrowth: 12.5,
  totalOrders: 320,
  ordersGrowth: 8.1,
  avgOrderValue: 766,
  avgGrowth: 4.6,
  newCustomers: 64,
  customerGrowth: 15.3,
  dailyPerformance: [
    { day: "May 9", revenue: 95000, orders: 38 },
    { day: "May 10", revenue: 120000, orders: 48 },
    { day: "May 11", revenue: 85000, orders: 32 },
    { day: "May 12", revenue: 140000, orders: 58 },
    { day: "May 13", revenue: 90000, orders: 36 },
    { day: "May 14", revenue: 115000, orders: 44 },
    { day: "May 15", revenue: 155000, orders: 64 }
  ],
  categoryShare: [
    { name: "Beverages", percent: 40, color: "#FF5A36" },
    { name: "Supplements", percent: 30, color: "#10B981" },
    { name: "Skincare", percent: 20, color: "#3B82F6" },
    { name: "Digital & Services", percent: 10, color: "#8B5CF6" }
  ]
};
