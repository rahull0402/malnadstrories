"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(name, email);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Left Panel: Photography and Narrative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-green overflow-hidden items-end p-16 text-warm-white select-none">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200"
          alt="Mist hanging on hills"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 max-w-md space-y-6">
          <blockquote className="font-serif text-3xl italic leading-relaxed text-warm-white/90">
            &ldquo;We take photos as a return ticket to a moment otherwise gone.&rdquo;
          </blockquote>
          <div className="border-t border-warm-white/20 pt-4">
            <cite className="text-xs font-bold uppercase tracking-widest text-accent-sand not-italic">
              Katie Thurmes
            </cite>
            <p className="text-[10px] text-warm-white/50 uppercase tracking-wider mt-1">
              Malnad Stories Preservation Studio
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-lg mb-4">
              <img src="/logo.png" alt="Malnad Stories Logo" className="h-9 w-9 object-contain" />
            </Link>
            <h1 className="font-serif text-3xl font-bold text-forest-green">Begin Your Journey</h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Create an account to preserve your chapters of life.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal/60" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-moss-green/10 bg-transparent text-sm text-charcoal outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green transition-all"
                placeholder="Vikram Dev"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal/60" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-moss-green/10 bg-transparent text-sm text-charcoal outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green transition-all"
                placeholder="you@domain.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal/60" htmlFor="password">
                Create Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-moss-green/10 bg-transparent text-sm text-charcoal outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-forest-green text-sm font-bold text-warm-white shadow-premium hover:bg-moss-green flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Start Preservation"}
            </button>
          </form>

          <div className="text-center lg:text-left text-xs text-charcoal/60 border-t border-moss-green/10 pt-6">
            Already registered?{" "}
            <Link href="/login" className="text-forest-green font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
