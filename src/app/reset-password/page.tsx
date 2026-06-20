"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-green overflow-hidden items-end p-16 text-warm-white select-none">
        <img
          src="https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1200"
          alt="Mist river"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 max-w-md space-y-6">
          <blockquote className="font-serif text-3xl italic leading-relaxed text-warm-white/90">
            &ldquo;Every sunrise is a clean slate to build new pathways.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-lg mb-4">
              <img src="/logo.png" alt="Malnad Stories Logo" className="h-9 w-9 object-contain" />
            </Link>
            <h1 className="font-serif text-3xl font-bold text-forest-green">Update Password</h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Choose a strong password to secure your travel memories.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-forest-green/10 border border-forest-green/20 p-6 rounded-xl text-center space-y-2">
              <span className="text-2xl">✓</span>
              <h3 className="font-serif font-bold text-forest-green">Password Updated</h3>
              <p className="text-xs text-charcoal/60">Redirecting to Login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/60" htmlFor="password">
                  New Password
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/60" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-moss-green/10 bg-transparent text-sm text-charcoal outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-forest-green text-sm font-bold text-warm-white shadow-premium hover:bg-moss-green flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
