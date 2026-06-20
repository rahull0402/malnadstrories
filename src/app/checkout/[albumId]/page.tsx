"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp, Coupon } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { 
  CreditCard, 
  MapPin, 
  Lock, 
  CheckCircle
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { albums, placeOrder, coupons } = useApp();
  
  const albumId = params.albumId as string;
  const album = albums.find(a => a.id === albumId) || null;

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const city = "Bengaluru";
  const shippingState = "Karnataka";
  const [pincode, setPincode] = useState("");
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!album) {
    return (
      <div className="flex h-screen items-center justify-center bg-warm-white">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-4 border-forest-green border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-forest-green">Preparing checkout details...</p>
        </div>
      </div>
    );
  }

  const subtotal = album.price;
  
  // Dynamic discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    // Make sure discount is not more than subtotal
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const shippingFee = 150;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || coupon).trim().toUpperCase();
    if (!code) {
      alert("Please enter a coupon code.");
      return;
    }
    const found = coupons.find(c => c.code.toUpperCase() === code);
    if (!found) {
      alert(`Invalid coupon code "${code}".`);
      return;
    }
    if (found.status !== "Active") {
      alert(`Coupon "${code}" is expired.`);
      return;
    }
    setAppliedCoupon(found);
    setCoupon(found.code);
    alert(`Coupon "${found.code}" applied! ₹${found.discountType === "percentage" ? found.discountValue + "%" : found.discountValue} discount subtracted from summary.`);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !pincode) {
      alert("Please fill in all shipping fields.");
      return;
    }
    
    setSubmitting(true);
    
    setTimeout(() => {
      const order = placeOrder(albumId, {
        fullName,
        email,
        phone,
        address,
        city,
        state: shippingState,
        pincode
      }, appliedCoupon ? appliedCoupon.code : undefined);
      
      setSubmitting(false);
      // Navigate to order confirmation and tracking!
      router.push(`/orders/${order.id}`);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white text-charcoal">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-left mb-10 pb-6 border-b border-moss-green/10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-sand">Secure checkout</span>
          <h1 className="font-serif text-3xl font-bold text-forest-green mt-1">Complete Your Preservation</h1>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: SHIPPING & PAYMENT DETAILS */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Shipping Details */}
            <div className="bg-white border border-moss-green/10 rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-forest-green flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent-sand" />
                <span>1. Shipping Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green"
                    placeholder="Ananya Hegde"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green"
                    placeholder="ananya@domain.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="pin">Pincode</label>
                  <input
                    id="pin"
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green"
                    placeholder="560041"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="addr">Street Address</label>
                <input
                  id="addr"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green"
                  placeholder="Flat 102, Green Meadows, Jayanagar"
                />
              </div>
            </div>

            {/* Step 2: Payment Details */}
            <div className="bg-white border border-moss-green/10 rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-forest-green flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent-sand" />
                <span>2. Payment Details</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="card">Card Number</label>
                  <input
                    id="card"
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green font-mono"
                    placeholder="4111 •••• •••• 1111"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="expiry">Expiry</label>
                    <input
                      id="expiry"
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-charcoal/50 uppercase" htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="password"
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full h-10 px-3 border border-moss-green/15 bg-transparent rounded-lg text-xs outline-none focus:border-forest-green font-mono"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-charcoal/50">
                <Lock className="h-3.5 w-3.5" />
                <span>Transactions are secured with 256-bit SSL encryption.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF9F6] border border-moss-green/10 rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
              <h3 className="font-serif text-lg font-bold text-forest-green pb-3 border-b border-moss-green/5">
                Order Summary
              </h3>

              {/* Book Details */}
              <div className="flex gap-4">
                <div 
                  className="w-16 h-20 rounded shadow-book shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: album.coverColor }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/15" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-forest-green">{album.title}</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">{album.destination}</p>
                  <span className="inline-block mt-2 text-[9px] font-bold text-accent-sand uppercase tracking-wider py-0.5 px-2 bg-forest-green/5 border border-forest-green/10 rounded-full">
                    {album.plan} Format
                  </span>
                </div>
              </div>

              {/* Coupons code */}
              <div className="pt-4 border-t border-moss-green/5 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-charcoal/50 uppercase">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. MALNAD10"
                      className="flex-1 h-9 px-3 border border-moss-green/15 bg-white rounded-lg text-xs outline-none focus:border-forest-green uppercase font-mono"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCoupon("");
                        }}
                        className="h-9 px-4 rounded-lg border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="h-9 px-4 rounded-lg border border-forest-green/20 text-xs font-bold text-forest-green hover:bg-forest-green/5"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-medium bg-green-50/50 p-2 rounded-lg border border-green-100">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      <span>Code <strong className="font-mono">{appliedCoupon.code}</strong> applied! Saved ₹{discountAmount}</span>
                    </div>
                  )}
                </div>

                {/* Myntra-style Available Coupons Tray */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Available Coupons</span>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {coupons.filter(c => c.status === "Active").map((c) => {
                      const isCurrent = appliedCoupon?.code === c.code;
                      return (
                        <div
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className={`group cursor-pointer p-3 rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-between ${
                            isCurrent
                              ? "border-forest-green bg-forest-green/[0.03] shadow-sm"
                              : "border-moss-green/15 bg-white hover:border-forest-green/45 hover:bg-forest-green/[0.01]"
                          }`}
                        >
                          <div className="space-y-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                                isCurrent 
                                  ? "bg-forest-green text-warm-white" 
                                  : "bg-moss-green/10 text-forest-green group-hover:bg-forest-green/10"
                              }`}>
                                {c.code}
                              </span>
                              <span className="text-[10px] font-extrabold text-accent-sand">
                                {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                              </span>
                            </div>
                            <p className="text-[10px] text-charcoal/70 leading-relaxed font-medium">
                              {c.description}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            className={`h-7 px-3 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                              isCurrent
                                ? "bg-forest-green text-warm-white pointer-events-none"
                                : "border border-forest-green/30 text-forest-green hover:bg-forest-green hover:text-warm-white"
                            }`}
                          >
                            {isCurrent ? "Applied" : "Apply"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Billing breakdown */}
              <div className="pt-4 border-t border-moss-green/5 space-y-2.5 text-xs">
                <div className="flex justify-between text-charcoal/70">
                  <span>Archival Book Pages ({album.pageCount} Pages)</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/70">
                  <span>Fine-Art Hardcover Binding</span>
                  <span className="text-green-700">Included</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Studio Tracked Shipping</span>
                  <span>₹{shippingFee}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-bold text-forest-green pt-3 border-t border-moss-green/5">
                  <span>Grand Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Submit Checkout */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-forest-green hover:bg-moss-green text-warm-white text-xs font-bold rounded-lg shadow-premium flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4.5 w-4.5" />
                    <span>Complete Order • ₹{totalAmount}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
