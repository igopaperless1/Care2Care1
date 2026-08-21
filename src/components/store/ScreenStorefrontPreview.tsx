import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  X,
  Tag,
  ShieldCheck,
  Truck,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { ProductItem, StoreOrder, StoreProfileModel, CouponItem, StoreTab } from "./types";

interface ScreenStorefrontPreviewProps {
  storeProfile: StoreProfileModel;
  products: ProductItem[];
  coupons: CouponItem[];
  onPlaceCustomerOrder: (order: StoreOrder, updatedProducts: { id: string; qty: number }[]) => void;
  onNavigate: (tab: StoreTab) => void;
}

interface CartItem {
  product: ProductItem;
  quantity: number;
}

export const ScreenStorefrontPreview: React.FC<ScreenStorefrontPreviewProps> = ({
  storeProfile,
  products,
  coupons,
  onPlaceCustomerOrder,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Customer Checkout Form
  const [customerName, setCustomerName] = useState("Aman Chaudhary");
  const [customerEmail, setCustomerEmail] = useState("aman@email.com");
  const [customerPhone, setCustomerPhone] = useState("+977 9860123456");
  const [customerAddress, setCustomerAddress] = useState("Jhamsikhel, Lalitpur");
  const [paymentMethod, setPaymentMethod] = useState<"eSewa" | "Khalti" | "Fonepay" | "Cash on Delivery">("eSewa");
  const [orderConfirmed, setOrderConfirmed] = useState<StoreOrder | null>(null);

  const categories = ["All", "Beverages", "Supplements", "Skincare", "Digital Goods", "Wellness Services"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCartDrawer(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + curr.product.sellingPrice * curr.quantity, 0);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.min(appliedCoupon.maxDiscount || Infinity, (subtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;

  const shippingCharge = subtotal >= (storeProfile.freeShippingThreshold || 2000) ? 0 : storeProfile.flatShippingCharge || 100;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.status === "Active");
    if (!found) {
      setCouponError("Invalid or expired coupon code");
      return;
    }
    if (subtotal < found.minSpend) {
      setCouponError(`Min spend of NPR ${found.minSpend} required`);
      return;
    }
    setAppliedCoupon(found);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder: StoreOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-000${Math.floor(130 + Math.random() * 800)}`,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Processing",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      paymentMethod,
      items: cart.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        totalPrice: item.product.sellingPrice * item.quantity
      })),
      subtotal,
      shippingCharge,
      tax: 0,
      discount: discountAmount,
      totalAmount: grandTotal
    };

    const stockDeductions = cart.map((item) => ({
      id: item.product.id,
      qty: item.quantity
    }));

    onPlaceCustomerOrder(newOrder, stockDeductions);
    setCart([]);
    setShowCheckoutModal(false);
    setShowCartDrawer(false);
    setOrderConfirmed(newOrder);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Storefront Notice Banner */}
      <div className="bg-emerald-600 text-white rounded-3xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-white/20 rounded-xl">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </span>
          <div>
            <strong>Interactive Live Storefront Preview</strong>
            <p className="text-[11px] text-emerald-100">Simulate customer orders, instant cart, and checkout workflows.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("store_setup")}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Customize Design
          </button>
        </div>
      </div>

      {/* 2. Storefront Hero Banner */}
      <div className="relative bg-white rounded-3xl border border-orange-100/90 shadow-2xs overflow-hidden">
        <div className="h-32 sm:h-44 w-full relative">
          <img
            src={storeProfile.bannerUrl}
            alt="Store Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 relative z-10">
          <div className="flex items-end gap-3.5">
            <img
              src={storeProfile.logoUrl}
              alt={storeProfile.storeName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900">{storeProfile.storeName}</h1>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{storeProfile.storeTagline}</p>
            </div>
          </div>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setShowCartDrawer(true)}
            className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-orange-500/25 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Cart ({totalCartCount})</span>
            {totalCartCount > 0 && (
              <span className="ml-1 bg-white text-[#FF5A36] px-2 py-0.5 rounded-full text-[10px] font-black">
                NPR {subtotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Search & Categories Filter */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-orange-100/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search healthy herbal teas, vitamins, natural care..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((c) => {
            const isSelected = selectedCategory === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5A36] text-white shadow-2xs"
                    : "bg-orange-50/60 hover:bg-orange-100 text-slate-600"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredProducts.map((p) => {
          const isOutOfStock = p.stock === 0;
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-3 border border-orange-100/90 shadow-2xs space-y-2.5 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="relative rounded-2xl overflow-hidden h-36 bg-orange-50">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {p.originalPrice && p.originalPrice > p.sellingPrice && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#FF5A36] text-white rounded-full text-[9px] font-black shadow-2xs">
                    SAVE {Math.round(((p.originalPrice - p.sellingPrice) / p.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">{p.category}</div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
              </div>

              <div className="pt-2 border-t border-orange-100 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-black text-slate-900">
                    NPR {p.sellingPrice.toLocaleString()}
                  </div>
                  {p.originalPrice && (
                    <div className="text-[10px] text-slate-400 line-through">
                      NPR {p.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => addToCart(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isOutOfStock
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? "Out of Stock" : "Add"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Cart Drawer (Modal / Sidebar) */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FF5A36]" /> Shopping Cart ({totalCartCount})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                  <div className="text-xs font-bold">Your cart is empty</div>
                  <p className="text-[11px]">Add herbal teas, vitamins, or soap items to check out</p>
                </div>
              ) : (
                <div className="divide-y divide-orange-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</div>
                          <div className="text-[11px] text-slate-500">
                            NPR {item.product.sellingPrice.toLocaleString()} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-orange-50 rounded-xl border border-orange-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -item.quantity)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Form */}
              {cart.length > 0 && (
                <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-orange-100 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g. SAVE20)"
                      className="flex-1 px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold uppercase text-slate-900 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon &ldquo;{appliedCoupon.code}&rdquo; applied (-NPR {discountAmount})
                    </div>
                  )}
                  {couponError && <div className="text-[11px] text-red-600 font-semibold">{couponError}</div>}
                </form>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-orange-100 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>NPR {subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>- NPR {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge</span>
                    <span>{shippingCharge === 0 ? "FREE" : `NPR ${shippingCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-orange-200">
                    <span>Total Pay</span>
                    <span className="text-[#FF5A36]">NPR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-orange-500/25 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full border border-orange-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF5A36]" /> Shipping & Instant Settlement
              </h3>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              {/* Payment Gateway Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "eSewa", label: "eSewa Direct" },
                    { id: "Khalti", label: "Khalti Wallet" },
                    { id: "Fonepay", label: "Fonepay QR" },
                    { id: "Cash on Delivery", label: "Cash on Delivery (COD)" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        paymentMethod === p.id
                          ? "bg-orange-50 border-[#FF5A36] text-[#FF5A36] ring-2 ring-[#FF5A36]"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-orange-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900">
                  Total Payable: <strong className="text-[#FF5A36] text-sm">NPR {grandTotal.toLocaleString()}</strong>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Order Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-500">
                Order ID: <strong className="text-slate-900">{orderConfirmed.orderNumber}</strong>
              </p>
            </div>

            <div className="p-3.5 bg-orange-50/40 rounded-2xl border border-orange-100 text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{orderConfirmed.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-black text-[#FF5A36]">NPR {orderConfirmed.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold text-emerald-700">{orderConfirmed.paymentMethod}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderConfirmed(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Continue Shopping
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderConfirmed(null);
                  onNavigate("orders");
                }}
                className="flex-1 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                View in Merchant Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
