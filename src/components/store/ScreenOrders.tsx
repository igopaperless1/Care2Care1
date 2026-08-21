import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChevronRight,
  User,
  DollarSign
} from "lucide-react";
import { StoreOrder, OrderStatus, StoreTab } from "./types";

interface ScreenOrdersProps {
  orders: StoreOrder[];
  onSelectOrder: (order: StoreOrder) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenOrders: React.FC<ScreenOrdersProps> = ({
  orders,
  onSelectOrder,
  onNavigate
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const filterTabs = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedFilter === "All Orders" || o.status === selectedFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Out for Delivery":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header & Search Control */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Orders Management ({orders.length})</h3>
              <p className="text-xs text-slate-500">Track customer purchases, fulfillment stages, & invoices</p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full pl-9 pr-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {filterTabs.map((tab) => {
            const isSelected = selectedFilter === tab;
            const count =
              tab === "All Orders"
                ? orders.length
                : orders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5A36] text-white shadow-2xs"
                    : "bg-slate-50 hover:bg-orange-50 text-slate-600"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? "bg-white text-[#FF5A36]" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Order List Cards */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-orange-100/90 shadow-2xs divide-y divide-orange-100/70">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
            <div className="text-xs font-bold">No orders found in this filter</div>
            <p className="text-[11px]">When customers place orders from your storefront, they will appear here</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => {
                onSelectOrder(order);
                onNavigate("order_details");
              }}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-orange-50/40 px-2 rounded-2xl transition-colors cursor-pointer"
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF5A36] border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{order.orderNumber}</span>
                    <span className="text-xs font-semibold text-slate-700">• {order.customerName}</span>
                    <span
                      className={`px-2 py-0.5 border rounded-full text-[10px] font-bold ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>
                      {order.date}, {order.time}
                    </span>
                    <span>•</span>
                    <span>{order.items.length} items</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-100">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-black text-slate-900">
                    NPR {order.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {order.paymentStatus === "Paid" ? "Payment Settled" : "COD Pending"}
                  </div>
                </div>

                <div className="p-1.5 bg-orange-50 group-hover:bg-[#FF5A36] text-[#FF5A36] group-hover:text-white rounded-xl transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
