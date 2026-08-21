import React, { useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Award,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { StoreTab } from "./types";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  tier: "VIP Customer" | "Regular" | "New";
  lastOrderDate: string;
}

interface ScreenCustomersProps {
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenCustomers: React.FC<ScreenCustomersProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const customers: CustomerRecord[] = [
    {
      id: "cust-1",
      name: "Ramesh Shrestha",
      email: "ramesh@email.com",
      phone: "+977 9812345678",
      city: "Lazimpat, Kathmandu",
      totalOrders: 4,
      totalSpend: 4500,
      tier: "VIP Customer",
      lastOrderDate: "15 May 2025"
    },
    {
      id: "cust-2",
      name: "Sita Karki",
      email: "sita@email.com",
      phone: "+977 9841234567",
      city: "Lakeside, Pokhara",
      totalOrders: 2,
      totalSpend: 1300,
      tier: "Regular",
      lastOrderDate: "15 May 2025"
    },
    {
      id: "cust-3",
      name: "Aman Chaudhary",
      email: "aman@email.com",
      phone: "+977 9860123456",
      city: "Jhamsikhel, Lalitpur",
      totalOrders: 1,
      totalSpend: 1090,
      tier: "New",
      lastOrderDate: "14 May 2025"
    },
    {
      id: "cust-4",
      name: "Priya Gurung",
      email: "priya@email.com",
      phone: "+977 9809876543",
      city: "Sallaghari, Bhaktapur",
      totalOrders: 3,
      totalSpend: 2150,
      tier: "Regular",
      lastOrderDate: "14 May 2025"
    }
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Customers CRM ({customers.length})</h3>
              <p className="text-xs text-slate-500">View customer lifetime value, ordering habits, & contact details</p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, city..."
              className="w-full pl-9 pr-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
            />
          </div>
        </div>
      </div>

      {/* 2. Customer List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((c) => {
          const isVip = c.tier === "VIP Customer";
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100/80 text-[#FF5A36] font-bold text-xs flex items-center justify-center">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                    <div className="text-[11px] text-slate-500">{c.city}</div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isVip
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {c.tier}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-orange-50/30 rounded-2xl border border-orange-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</span>
                  <div className="text-xs font-bold text-slate-800">{c.totalOrders} completed</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Spent</span>
                  <div className="text-xs font-black text-[#FF5A36]">NPR {c.totalSpend.toLocaleString()}</div>
                </div>
              </div>

              {/* Contacts & Quick Actions */}
              <div className="pt-2 border-t border-orange-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 truncate">
                  Last order: {c.lastOrderDate}
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${c.phone}`}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors cursor-pointer"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${c.email}`}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors cursor-pointer"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate("orders")}
                    className="p-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] rounded-xl transition-colors cursor-pointer"
                    title="View Orders"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
