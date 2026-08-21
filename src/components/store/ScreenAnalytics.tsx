import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Package,
  Award,
  Globe
} from "lucide-react";
import { ProductItem, StoreOrder, StoreTab } from "./types";

interface ScreenAnalyticsProps {
  products: ProductItem[];
  orders: StoreOrder[];
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenAnalytics: React.FC<ScreenAnalyticsProps> = ({
  products,
  orders,
  onNavigate
}) => {
  const [timeRange, setTimeRange] = useState("This Month");

  const monthlySales = [
    { month: "Jan", revenue: 140000, orders: 110 },
    { month: "Feb", revenue: 165000, orders: 125 },
    { month: "Mar", revenue: 195000, orders: 145 },
    { month: "Apr", revenue: 210000, orders: 160 },
    { month: "May", revenue: 245000, orders: 184 },
    { month: "Jun (Est)", revenue: 270000, orders: 200 }
  ];

  const maxRevenue = Math.max(...monthlySales.map((s) => s.revenue));

  const topProducts = [
    { name: "Organic Green Tea", sku: "TEA-001", salesCount: 45, revenue: 20250, percent: 85 },
    { name: "Vitamin C 1000mg Effervescent", sku: "VITC-100", salesCount: 38, revenue: 24700, percent: 75 },
    { name: "Handmade Herbal Neem Soap", sku: "SOAP-002", salesCount: 32, revenue: 4800, percent: 60 },
    { name: "Raw Himalayan Honey 500g", sku: "HNY-500", salesCount: 29, revenue: 24650, percent: 55 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-3xl p-3 sm:p-4 border border-orange-100/90 shadow-2xs flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Analytics & Sales Performance</h3>
            <p className="text-[11px] text-slate-500">Real-time revenue metrics, order velocity, & top items</p>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 bg-orange-50/50 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
        >
          <option value="This Month">This Month (May 2025)</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last Quarter">Last Quarter (Q1)</option>
          <option value="This Year">This Year (2025)</option>
        </select>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">NPR 245,000</div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% growth
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">184</div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.1% orders
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Order Value</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">NPR 1,331</div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5.6% basket
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">3.4%</div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +0.8% sessions
          </div>
        </div>
      </div>

      {/* 3. Monthly Sales Velocity Chart */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Monthly Revenue Growth (NPR)</h4>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Target on Track: 92%
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
          {monthlySales.map((item) => {
            const heightPercent = (item.revenue / maxRevenue) * 100;
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(item.revenue / 1000).toFixed(0)}k
                </div>
                <div className="w-full max-w-[42px] bg-orange-100 rounded-t-xl overflow-hidden h-32 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-[#FF5A36] to-[#FF7A59] rounded-t-xl group-hover:brightness-110 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Top Selling Leaderboard & Traffic Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Selling Products */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Best Performing Products
            </h4>
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className="text-[11px] font-bold text-[#FF5A36] hover:underline cursor-pointer"
            >
              Catalog
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.sku} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 truncate max-w-[200px]">{p.name}</span>
                  <span className="text-slate-700">NPR {p.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{p.sku} • {p.salesCount} sold</span>
                  <span>{p.percent}% of category</span>
                </div>
                <div className="w-full h-1.5 bg-orange-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF5A36] rounded-full"
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Channels */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-500" /> Customer Acquisition Channels
          </h4>

          <div className="space-y-2.5">
            {[
              { channel: "Care2Care Marketplace App", percent: 48, orders: 88, color: "#FF5A36" },
              { channel: "Direct Custom Subdomain", percent: 32, orders: 59, color: "#10B981" },
              { channel: "Social Media (Instagram/TikTok)", percent: 14, orders: 26, color: "#3B82F6" },
              { channel: "Referrals & WhatsApp", percent: 6, orders: 11, color: "#8B5CF6" }
            ].map((c) => (
              <div key={c.channel} className="p-3 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-800">{c.channel}</span>
                  </div>
                  <span className="text-slate-900">{c.percent}%</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>{c.orders} orders attributed</span>
                  <span>NPR {(c.orders * 1331).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
