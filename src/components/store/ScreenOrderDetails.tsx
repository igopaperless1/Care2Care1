import React, { useState } from "react";
import {
  Receipt,
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ShieldCheck,
  PackageCheck,
  DollarSign
} from "lucide-react";
import { StoreOrder, OrderStatus, StoreTab } from "./types";

interface ScreenOrderDetailsProps {
  order: StoreOrder | null;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenOrderDetails: React.FC<ScreenOrderDetailsProps> = ({
  order,
  onUpdateOrderStatus,
  onNavigate
}) => {
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-3">
        <Receipt className="w-12 h-12 mx-auto text-slate-300" />
        <h3 className="text-sm font-bold text-slate-900">No Order Selected</h3>
        <p className="text-xs text-slate-500">Please select an order from your order management dashboard.</p>
        <button
          type="button"
          onClick={() => onNavigate("orders")}
          className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl text-xs font-bold"
        >
          View All Orders
        </button>
      </div>
    );
  }

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 1. Header with Back Button */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("orders")}
            className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-600 border border-slate-200 cursor-pointer"
            title="Back to Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{order.orderNumber}</span>
              <span
                className={`text-xs px-2.5 py-0.5 border rounded-full font-bold ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Placed on {order.date} at {order.time} via {order.paymentMethod}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print Tax Invoice</span>
        </button>
      </div>

      {/* 2. Customer Details Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer & Delivery Info</h4>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-orange-50/40 rounded-2xl border border-orange-100">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900">{order.customerName}</div>
            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>{order.customerEmail}</span>
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{order.customerPhone}</span>
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{order.customerAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${order.customerPhone}`}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1"
              title="Call Customer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <a
              href={`sms:${order.customerPhone}`}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1"
              title="Message Customer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </a>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900 font-semibold">
                Carrier: <strong>{order.deliveryPartner}</strong>
              </span>
            </div>
            <div className="font-bold text-blue-800">
              AWB: {order.trackingNumber}
            </div>
          </div>
        )}
      </div>

      {/* 3. Order Items Table */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Ordered Items ({order.items.length})</h4>

        <div className="divide-y divide-orange-100/70">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.productName}</div>
                  <div className="text-[11px] text-slate-500">
                    {item.quantity} x NPR {item.unitPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-xs font-black text-slate-900">
                NPR {item.totalPrice.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-3 border-t border-orange-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>NPR {order.subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Shipping Charge</span>
            <span>{order.shippingCharge === 0 ? "FREE" : `NPR ${order.shippingCharge}`}</span>
          </div>

          {order.tax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax (13% VAT)</span>
              <span>NPR {order.tax.toLocaleString()}</span>
            </div>
          )}

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount</span>
              <span>- NPR {order.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-orange-200">
            <span>Total Amount</span>
            <span className="text-[#FF5A36]">NPR {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        {order.status !== "Cancelled" && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`Cancel order ${order.orderNumber}?`)) {
                onUpdateOrderStatus(order.id, "Cancelled");
              }
            }}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {order.status === "Processing" && (
            <button
              type="button"
              onClick={() => onUpdateOrderStatus(order.id, "Shipped")}
              className="px-5 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Mark as Shipped</span>
            </button>
          )}

          {order.status === "Shipped" && (
            <button
              type="button"
              onClick={() => onUpdateOrderStatus(order.id, "Delivered")}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Delivered</span>
            </button>
          )}

          {order.status === "Delivered" && (
            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Order Fulfilled</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
