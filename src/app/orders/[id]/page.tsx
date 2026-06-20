"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Order } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { 
  Check, 
  Wand2, 
  Truck,
  Box
} from "lucide-react";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, updateOrderStatus } = useApp();
  
  const orderId = params.id as string;
  const order = orders.find(o => o.id === orderId) || null;

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center bg-warm-white">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-4 border-forest-green border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-forest-green">Locating printing record...</p>
        </div>
      </div>
    );
  }

  const stages: Order["status"][] = [
    "Ordered",
    "Processing",
    "Printing",
    "Quality Check",
    "Packed",
    "Shipped",
    "Delivered"
  ];

  const currentStageIndex = stages.indexOf(order.status);

  // Administrative simulation tool helper to advance order state
  const handleAdvanceStatus = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStatus = stages[currentStageIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    } else {
      alert("Order has already been delivered!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white text-charcoal">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Top summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-moss-green/10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-sand">tracked production</span>
            <h1 className="font-serif text-3xl font-bold text-forest-green mt-1">Order Status: {order.status}</h1>
            <p className="text-xs text-charcoal/50 mt-1">ID: {order.id} • Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3">
            {/* Simulator action */}
            <button
              onClick={handleAdvanceStatus}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-moss-green/20 bg-forest-green/5 px-4 text-xs font-bold text-forest-green hover:bg-forest-green/10"
              title="Simulate print facility progression"
            >
              <Wand2 className="h-4 w-4" />
              <span>Simulate Next Phase</span>
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-forest-green px-4 text-xs font-semibold text-warm-white shadow-premium"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* SECTION: VISUAL TIMELINE */}
        <section className="bg-white border border-moss-green/10 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          <h3 className="font-serif text-lg font-bold text-forest-green">Production Timeline</h3>
          
          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-[15px] left-[5%] right-[5%] h-0.5 bg-moss-green/15 -z-10" />
            
            {/* Timeline nodes */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 text-center md:text-center relative">
              {stages.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;

                return (
                  <div key={stage} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                    
                    {/* Node circle */}
                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                      isCompleted 
                        ? "border-green-600 bg-green-600 text-white" 
                        : isActive 
                        ? "border-forest-green bg-white text-forest-green ring-4 ring-forest-green/10 scale-110 animate-pulse" 
                        : "border-moss-green/15 bg-white text-charcoal/30"
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>

                    {/* Metadata text */}
                    <div className="text-left md:text-center">
                      <h4 className={`text-xs font-bold ${isActive ? "text-forest-green" : "text-charcoal/70"}`}>
                        {stage}
                      </h4>
                      {isActive && (
                        <span className="text-[9px] font-bold text-accent-sand uppercase tracking-wider block md:inline mt-0.5">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: DETAILED EVENT LOG */}
          <section className="lg:col-span-7 bg-white border border-moss-green/10 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-forest-green pb-3 border-b border-moss-green/5">
              Production Log
            </h3>
            
            <div className="space-y-6 relative border-l border-moss-green/10 ml-3 pl-6">
              {order.trackingUpdates.map((update, idx) => (
                <div key={idx} className="relative space-y-1">
                  {/* Indicator bullet */}
                  <div className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border border-forest-green bg-forest-green" />
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-forest-green">{update.status}</h4>
                    <span className="text-[10px] text-charcoal/40 font-mono">{update.date}</span>
                  </div>
                  <p className="text-xs text-charcoal/70">{update.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: SHIPPING DETAILS & PREVIEW SUMMARY */}
          <section className="lg:col-span-5 space-y-6">
            {/* Delivery address */}
            <div className="bg-[#FAF9F6] border border-moss-green/10 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-forest-green flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent-sand" />
                <span>Shipping Address</span>
              </h3>
              
              <div className="text-xs space-y-1 text-charcoal/80">
                <p className="font-bold text-forest-green">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="pt-2">Contact: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Print details */}
            <div className="bg-[#FAF9F6] border border-moss-green/10 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-forest-green flex items-center gap-2">
                <Box className="h-5 w-5 text-accent-sand" />
                <span>Package Information</span>
              </h3>

              <div className="text-xs space-y-2 text-charcoal/80">
                <div className="flex justify-between">
                  <span>Album Title</span>
                  <span className="font-semibold text-forest-green">{order.albumTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format</span>
                  <span>{order.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount Paid</span>
                  <span className="font-bold text-forest-green">₹{order.amount}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
