"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Order } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  Users, 
  Tag, 
  Truck, 
  BarChart3, 
  Layers, 
  CheckCircle,
  Edit2
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { orders, albums, updateOrderStatus, currentUser, loading, coupons, createCoupon } = useApp();
  
  // Tab states: orders, customers, albums, coupons, covers
  const [activeTab, setActiveTab] = useState<"orders" | "customers" | "albums" | "coupons" | "covers">("orders");

  // Create Coupon Form States
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState(10);
  const [newDesc, setNewDesc] = useState("");

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDesc || newValue <= 0) {
      alert("Please fill in all coupon fields correctly.");
      return;
    }
    
    // Check if code already exists
    if (coupons.some(c => c.code === newCode)) {
      alert("A coupon with this code already exists.");
      return;
    }

    createCoupon({
      code: newCode.toUpperCase(),
      discountType: newType,
      discountValue: newValue,
      description: newDesc,
      status: "Active",
      usage: 0
    });

    // Reset Form
    setNewCode("");
    setNewType("percentage");
    setNewValue(10);
    setNewDesc("");
    alert(`Coupon ${newCode.toUpperCase()} successfully created!`);
  };

  useEffect(() => {
    if (!loading) {
      if (!currentUser || currentUser.role !== "admin") {
        router.push("/admin/login");
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <div className="text-forest-green font-serif text-lg animate-pulse">Loading admin workspace...</div>
      </div>
    );
  }

  // Simulated business statistics
  const simulatedRevenue = orders.reduce((sum, o) => sum + o.amount, 0) + 78200; // adding simulated base
  const totalAlbumsCount = albums.length + 314;
  const aov = Math.round(simulatedRevenue / (orders.length + 32));
  const conversionRate = "4.2%";

  const mockCustomers = [
    { name: currentUser?.name || "Vikram Dev", email: currentUser?.email || "vikram@malnadstories.com", phone: "+91 98765 43210", albums: albums.length, city: "Bengaluru" },
    { name: "Ananya Hegde", email: "ananya.hegde@gmail.com", phone: "+91 94481 00222", albums: 1, city: "Coorg" },
    { name: "Kiran Kumar", email: "kiran@gmail.com", phone: "+91 99001 88776", albums: 3, city: "Srinagar" },
    { name: "Meera Nair", email: "meera@yahoo.com", phone: "+91 91234 56789", albums: 2, city: "Kochi" }
  ];



  const mockCovers = [
    { name: "Emerald Forest Linen", material: "Premium Dyed Linen", availability: "In Stock", weight: "240 gsm" },
    { name: "Western Ghats Canvas", material: "Organic Coated Canvas", availability: "In Stock", weight: "280 gsm" },
    { name: "Gold Sand Clad Leather", material: "Responsibly Sourced Leather", availability: "Low Stock", weight: "320 gsm" },
    { name: "Mist White Texture Board", material: "Fine Uncoated Board", availability: "In Stock", weight: "300 gsm" }
  ];

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white text-charcoal">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Workspace banner */}
        <div className="flex justify-between items-center pb-6 border-b border-moss-green/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-sand flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Workspace</span>
            </span>
            <h1 className="font-serif text-3xl font-bold text-forest-green mt-1">Enterprise Analytics</h1>
          </div>
          <span className="text-xs text-charcoal/50">Studio Portal v1.2</span>
        </div>

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Total Revenue</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">₹{simulatedRevenue.toLocaleString("en-IN")}</h3>
              <p className="text-[10px] text-green-700 font-medium">▲ +12.4% vs last month</p>
            </div>
          </div>

          {/* Albums Bound */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Albums Bound</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">{totalAlbumsCount}</h3>
              <p className="text-[10px] text-charcoal/50">Active print layouts</p>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Average Order Value</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">₹{aov.toLocaleString("en-IN")}</h3>
              <p className="text-[10px] text-charcoal/50">Explorer is primary choice</p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Conversion Rate</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">{conversionRate}</h3>
              <p className="text-[10px] text-green-700 font-medium">▲ +0.6% this week</p>
            </div>
          </div>
        </section>

        {/* ANALYTICS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Performance Chart (SVG) */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-green">Sales Performance</h3>
              <p className="text-xs text-charcoal/50">Monthly revenue growth for 2026</p>
            </div>
            
            <div className="h-64 w-full flex items-end justify-between px-2 pt-8 pb-2 relative">
              {/* Background grid lines */}
              <div className="absolute inset-x-0 top-8 border-b border-moss-green/5 text-[9px] text-charcoal/30 font-mono flex justify-between">
                <span>₹1,00,000</span>
              </div>
              <div className="absolute inset-x-0 top-20 border-b border-moss-green/5 text-[9px] text-charcoal/30 font-mono flex justify-between">
                <span>₹75,000</span>
              </div>
              <div className="absolute inset-x-0 top-32 border-b border-moss-green/5 text-[9px] text-charcoal/30 font-mono flex justify-between">
                <span>₹50,000</span>
              </div>
              <div className="absolute inset-x-0 top-44 border-b border-moss-green/5 text-[9px] text-charcoal/30 font-mono flex justify-between">
                <span>₹25,000</span>
              </div>

              {[
                { month: "Jan", revenue: 48000, height: "48%" },
                { month: "Feb", revenue: 56000, height: "56%" },
                { month: "Mar", revenue: 64000, height: "64%" },
                { month: "Apr", revenue: 70000, height: "70%" },
                { month: "May", revenue: 82000, height: "82%" },
                { month: "Jun", revenue: 92000, height: "92%" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group z-10 relative">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-forest-green text-warm-white text-[9px] font-bold py-1 px-2 rounded absolute -top-8 shadow duration-200 z-20 pointer-events-none whitespace-nowrap">
                    ₹{item.revenue.toLocaleString()}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-8 sm:w-10 bg-gradient-to-t from-forest-green/80 to-moss-green rounded-t-md hover:from-forest-green hover:to-accent-sand hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
                    style={{ height: item.height }}
                  />
                  
                  {/* Month Label */}
                  <span className="text-[10px] font-bold text-charcoal/60 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Pipeline Status breakdown */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-green">Fulfillment Pipeline</h3>
              <p className="text-xs text-charcoal/50">Active order status counts in print studio</p>
            </div>
            
            <div className="space-y-3 pt-2">
              {[
                { status: "Ordered", count: orders.filter(o => o.status === "Ordered").length + 12, max: 30 },
                { status: "Processing", count: orders.filter(o => o.status === "Processing").length + 8, max: 30 },
                { status: "Printing", count: orders.filter(o => o.status === "Printing").length + 15, max: 30 },
                { status: "Quality Check", count: orders.filter(o => o.status === "Quality Check").length + 6, max: 30 },
                { status: "Packed", count: orders.filter(o => o.status === "Packed").length + 4, max: 30 },
                { status: "Shipped", count: orders.filter(o => o.status === "Shipped").length + 18, max: 30 },
                { status: "Delivered", count: orders.filter(o => o.status === "Delivered").length + 85, max: 120 }
              ].map(({ status, count, max }) => {
                const percentage = Math.min(100, Math.round((count / max) * 100));
                
                return (
                  <div key={status} className="space-y-1 group">
                    <div className="flex justify-between text-xs font-semibold text-charcoal/80">
                      <span className="font-medium">{status}</span>
                      <span className="font-mono text-forest-green font-bold">{count} orders</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-charcoal/5 h-2 rounded-full overflow-hidden border border-moss-green/5 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-forest-green to-moss-green group-hover:from-forest-green group-hover:to-accent-sand h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT TABLE (Tabbed) */}
          <div className="lg:col-span-8 bg-white border border-moss-green/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Tabs Header */}
            <div className="flex border-b border-moss-green/5 bg-forest-green/5 text-xs">
              {[
                { id: "orders", label: "Orders", icon: Truck },
                { id: "customers", label: "Customers", icon: Users },
                { id: "albums", label: "Albums", icon: BookOpen },
                { id: "coupons", label: "Coupons", icon: Tag },
                { id: "covers", label: "Covers & Papers", icon: Layers }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "orders" | "customers" | "albums" | "coupons" | "covers")}
                  className={`flex-1 py-4 text-center font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id 
                      ? "border-forest-green text-forest-green bg-white" 
                      : "border-transparent text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab: Orders */}
            {activeTab === "orders" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-forest-green/5 border-b border-moss-green/10 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Album title</th>
                      <th className="p-4">Pages</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Modify Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss-green/5">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-forest-green/[0.01] transition-colors">
                        <td className="p-4 font-bold text-forest-green">{order.id}</td>
                        <td className="p-4 font-serif font-bold text-charcoal/80">{order.albumTitle}</td>
                        <td className="p-4">{order.plan}</td>
                        <td className="p-4 font-bold">₹{order.amount}</td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                            className="h-8 px-2 rounded border border-moss-green/15 text-xs bg-white focus:outline-none"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Processing">Processing</option>
                            <option value="Printing">Printing</option>
                            <option value="Quality Check">Quality Check</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Customers */}
            {activeTab === "customers" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-forest-green/5 border-b border-moss-green/10 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Active Albums</th>
                      <th className="p-4">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss-green/5">
                    {mockCustomers.map((cust, i) => (
                      <tr key={i} className="hover:bg-forest-green/[0.01]">
                        <td className="p-4 font-serif font-bold text-forest-green">{cust.name}</td>
                        <td className="p-4 font-mono">{cust.email}</td>
                        <td className="p-4">{cust.phone}</td>
                        <td className="p-4 font-bold">{cust.albums}</td>
                        <td className="p-4">{cust.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Albums */}
            {activeTab === "albums" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-forest-green/5 border-b border-moss-green/10 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                      <th className="p-4">ID</th>
                      <th className="p-4">Journal Title</th>
                      <th className="p-4">Primary Destination</th>
                      <th className="p-4">Pages Count</th>
                      <th className="p-4">Builder Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss-green/5">
                    {albums.map((al) => (
                      <tr key={al.id} className="hover:bg-forest-green/[0.01]">
                        <td className="p-4 font-mono text-[10px] text-charcoal/50">{al.id}</td>
                        <td className="p-4 font-serif font-bold text-forest-green">{al.title}</td>
                        <td className="p-4">{al.destination}</td>
                        <td className="p-4 font-bold">{al.pageCount} Pages</td>
                        <td className="p-4 uppercase tracking-wider text-[10px] font-bold text-accent-sand">{al.builderType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Coupons */}
            {activeTab === "coupons" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                {/* Create Coupon Form */}
                <div className="md:col-span-1 bg-forest-green/5 p-5 rounded-xl border border-moss-green/10 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-forest-green">Create New Coupon</h3>
                  <form onSubmit={handleCreateCouponSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-charcoal/50 uppercase">Coupon Code</label>
                      <input
                        type="text"
                        required
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SUMMER25"
                        className="w-full h-9 px-3 border border-moss-green/15 bg-white rounded-lg text-xs outline-none focus:border-forest-green uppercase font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-charcoal/50 uppercase">Discount Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as "percentage" | "fixed")}
                        className="w-full h-9 px-2 border border-moss-green/15 bg-white rounded-lg text-xs outline-none focus:border-forest-green"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Value (₹)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-charcoal/50 uppercase">Discount Value</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newValue}
                        onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
                        placeholder="e.g. 15 or 500"
                        className="w-full h-9 px-3 border border-moss-green/15 bg-white rounded-lg text-xs outline-none focus:border-forest-green"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-charcoal/50 uppercase">Description</label>
                      <input
                        type="text"
                        required
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="e.g. 15% Off all volumes"
                        className="w-full h-9 px-3 border border-moss-green/15 bg-white rounded-lg text-xs outline-none focus:border-forest-green"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-9 rounded-lg bg-forest-green hover:bg-moss-green text-warm-white text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* Coupons Table */}
                <div className="md:col-span-2 overflow-x-auto bg-white rounded-xl border border-moss-green/5 shadow-inner">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-forest-green/5 border-b border-moss-green/10 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Discount details</th>
                        <th className="p-4">Active Status</th>
                        <th className="p-4">Usage Counts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-moss-green/5">
                      {coupons.map((c, i) => (
                        <tr key={i} className="hover:bg-forest-green/[0.01]">
                          <td className="p-4 font-mono font-bold text-forest-green">{c.code}</td>
                          <td className="p-4">{c.description || (c.discountType === "percentage" ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`)}</td>
                          <td className="p-4">
                            <span className={`text-[10px] uppercase font-bold tracking-wider py-0.5 px-2.5 rounded-full ${
                              c.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 font-bold">{c.usage} times used</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Covers & Materials */}
            {activeTab === "covers" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-forest-green/5 border-b border-moss-green/10 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                      <th className="p-4">Cover cloth material</th>
                      <th className="p-4">Details</th>
                      <th className="p-4">Weight</th>
                      <th className="p-4">Inventory Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss-green/5">
                    {mockCovers.map((cov, i) => (
                      <tr key={i} className="hover:bg-forest-green/[0.01]">
                        <td className="p-4 font-serif font-bold text-forest-green">{cov.name}</td>
                        <td className="p-4">{cov.material}</td>
                        <td className="p-4 font-mono">{cov.weight}</td>
                        <td className="p-4 font-bold">{cov.availability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR: DESTINATIONS & REGIONAL PERFORMANCE */}
          <div className="lg:col-span-4 bg-[#FAF9F6] border border-moss-green/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-forest-green flex items-center gap-1.5 pb-3 border-b border-moss-green/5">
              <BarChart3 className="h-4.5 w-4.5 text-accent-sand" />
              <span>Popular Destinations</span>
            </h3>

            <div className="space-y-4">
              {[
                { name: "Kashmir valleys", count: 142, percentage: 42 },
                { name: "Chikmagalur trails", count: 94, percentage: 28 },
                { name: "Coorg coffee estates", count: 62, percentage: 18 },
                { name: "Gokarna shoreline cliffs", count: 40, percentage: 12 }
              ].map((dest, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-charcoal/80">
                    <span className="font-serif">{dest.name}</span>
                    <span>{dest.count} books ({dest.percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-charcoal/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-forest-green h-full" 
                      style={{ width: `${dest.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-forest-green text-warm-white p-4 rounded-xl space-y-2 mt-6">
              <h4 className="text-xs font-bold text-accent-sand uppercase tracking-wider">Studio Note</h4>
              <p className="text-[10px] leading-relaxed text-warm-white/70">
                Archival papers (uncoated natural matte) have been replenished. Ensure cover laminators align gold sand foil exactly along book spine edges.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
