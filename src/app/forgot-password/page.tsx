"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-green overflow-hidden items-end p-16 text-warm-white select-none">
        <img
          src="https://images.unsplash.com/photo-1595954421288-adc3e2104005?q=80&w=1200"
          alt="Mist valley"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 max-w-md space-y-6">
          <blockquote className="font-serif text-3xl italic leading-relaxed text-warm-white/90">
            &ldquo;Nothing is lost that is kept in the quiet chambers of the mind.&rdquo;
          </blockquote>
          <div className="border-t border-warm-white/20 pt-4">
            <cite className="text-xs font-bold uppercase tracking-widest text-accent-sand not-italic">
              Traditional Malnad Proverb
            </cite>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-lg mb-4">
              <img src="/logo.png" alt="Malnad Stories Logo" className="h-9 w-9 object-contain" />
            </Link>
            <h1 className="font-serif text-3xl font-bold text-forest-green">Reset Password</h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Provide your email to receive recovery instructions.
            </p>
          </div>

          {!isSubmitted ? (
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-forest-green text-sm font-bold text-warm-white shadow-premium hover:bg-moss-green flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isLoading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="bg-forest-green/5 border border-forest-green/10 p-6 rounded-xl space-y-4">
              <p className="text-sm text-charcoal/80 leading-relaxed">
                We have sent instructions to <strong className="text-forest-green">{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link
                href="/reset-password?email=demo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-green hover:underline"
              >
                Proceed to Reset screen (Demo) →
              </Link>
            </div>
          )}

          <div className="text-center lg:text-left text-xs text-charcoal/60 border-t border-moss-green/10 pt-6">
            Remembered?{" "}
            <Link href="/login" className="text-forest-green font-bold hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
