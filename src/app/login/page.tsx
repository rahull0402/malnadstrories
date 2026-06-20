"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
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

    // Simulating Apple-like fast loading transition
    setTimeout(() => {
      setIsLoading(false);
      if (email.toLowerCase() === "admin@malnadstories.com") {
        setErrorMsg("This login form is for customers. Admins please log in via the Administration Console.");
        return;
      }
      login("Vikram Dev", email);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Left Panel: Photography and Narrative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-green overflow-hidden items-end p-16 text-warm-white select-none">
        {/* Unsplash Forest Mist image */}
        <img
          src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200"
          alt="Mist hanging on forest pines"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 max-w-md space-y-6">
          <blockquote className="font-serif text-3xl italic leading-relaxed text-warm-white/90">
            &ldquo;Memory is the diary we all carry about with us.&rdquo;
          </blockquote>
          <div className="border-t border-warm-white/20 pt-4">
            <cite className="text-xs font-bold uppercase tracking-widest text-accent-sand not-italic">
              Oscar Wilde
            </cite>
            <p className="text-[10px] text-warm-white/50 uppercase tracking-wider mt-1">
              Malnad Stories Preservation Studio
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Minimalist Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-lg mb-4">
              <img src="/logo.png" alt="Malnad Stories Logo" className="h-9 w-9 object-contain" />
            </Link>
            <h1 className="font-serif text-3xl font-bold text-forest-green">Welcome Back</h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Enter your credentials to access your memory workspace.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in duration-300">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <div>
                <span>{errorMsg} </span>
                <Link href="/admin/login" className="underline font-bold text-forest-green hover:text-moss-green block mt-1">
                  Go to Administration Console &rarr;
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-charcoal/60" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-forest-green hover:underline"
                >
                  Forgot?
                </Link>
              </div>
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
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center lg:text-left text-xs text-charcoal/60 border-t border-moss-green/10 pt-6">
            New traveler?{" "}
            <Link href="/signup" className="text-forest-green font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
