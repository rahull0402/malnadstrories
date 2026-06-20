"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      if (email.toLowerCase() !== "admin@malnadstories.com") {
        setErrorMsg("Access Denied: Only admin credentials can access the administration workspace.");
        return;
      }
      login("Admin User", email);
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-charcoal">
      {/* Left Panel: Graphic & Narrative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-green overflow-hidden items-end p-16 text-warm-white select-none">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"
          alt="High peak mist valleys"
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
        
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-sand/15 text-accent-sand mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-warm-white">
            Administration Console
          </h2>
          <p className="text-sm text-warm-white/70 leading-relaxed">
            Authorized personnel only. Monitor production cycles, manage live inventory sheets, create promotional coupons, and audit studio transactions.
          </p>
          <div className="border-t border-warm-white/10 pt-4 text-[10px] text-warm-white/40 uppercase tracking-widest font-mono">
            Secure Studio Portal v1.2
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-[#121212]">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
              <img src="/logo.png" alt="Malnad Stories Logo" className="h-10 w-10 object-contain" />
            </Link>
            <h1 className="font-serif text-2xl font-bold text-warm-white">Studio Admin</h1>
            <p className="text-xs text-warm-white/50 mt-1">
              Enter your administrative credentials to audit production.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-warm-white/60" htmlFor="email">
                Admin Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-warm-white/10 bg-warm-white/5 text-sm text-warm-white outline-none focus:border-accent-sand transition-all"
                placeholder="admin@malnadstories.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-warm-white/60" htmlFor="password">
                Security Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-warm-white/10 bg-warm-white/5 text-sm text-warm-white outline-none focus:border-accent-sand transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-forest-green text-sm font-bold text-warm-white hover:bg-moss-green flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg cursor-pointer"
            >
              {isLoading ? "Validating Session..." : "Enter Workspace"}
            </button>
          </form>

          <div className="text-center lg:text-left text-xs text-warm-white/40 border-t border-warm-white/10 pt-6">
            Looking for traveler workspace?{" "}
            <Link href="/login" className="text-accent-sand font-bold hover:underline">
              Traveler Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
