"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, BookOpen, Compass, Shield, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-moss-green/10 bg-warm-white/75 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center transition-transform duration-500 group-hover:rotate-12">
            <img src="/logo.png" alt="Malnad Stories Logo" className="h-10 w-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-forest-green">
              Malnad Stories
            </span>
            <span className="text-[10px] uppercase tracking-widest text-accent-sand font-semibold -mt-1">
              Travel Journals
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#story" className="text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors">
            Preservation
          </Link>
          <Link href="/#destinations" className="text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors">
            Destinations
          </Link>
          <Link href="/#samples" className="text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors">
            Sample Albums
          </Link>
          <Link href="/#plans" className="text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1 text-sm font-medium text-charcoal/60 hover:text-forest-green transition-colors"
                  title="Admin Workspace"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              {currentUser.role === "user" && (
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors"
                >
                  <User className="h-4 w-4 text-forest-green" />
                  <span>{currentUser.name}</span>
                </Link>
              )}
              
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-sm font-medium text-charcoal/60 hover:text-red-600 transition-colors cursor-pointer"
              >
                Sign Out
              </button>

              <button
                onClick={() => router.push("/albums/new")}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-forest-green px-4 text-xs font-semibold text-warm-white shadow-premium transition-all duration-300 hover:bg-moss-green hover:-translate-y-0.5 active:translate-y-0"
              >
                Create Your Story
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-charcoal/80 hover:text-forest-green transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="inline-flex h-9 items-center justify-center rounded-lg border border-forest-green/20 bg-warm-white text-xs font-semibold text-forest-green shadow-sm transition-all duration-300 hover:bg-forest-green/5 px-4"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {currentUser ? (
            currentUser.role === "admin" ? (
              <Link href="/admin" className="text-charcoal hover:text-forest-green">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link href="/dashboard" className="text-charcoal hover:text-forest-green">
                <User className="h-5 w-5" />
              </Link>
            )
          ) : (
            <Link href="/login" className="text-charcoal hover:text-forest-green">
              <User className="h-5 w-5" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-charcoal hover:text-forest-green focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-moss-green/10 bg-warm-white px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/#story" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-charcoal/80"
            >
              Preservation
            </Link>
            <Link 
              href="/#destinations" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-charcoal/80"
            >
              Destinations
            </Link>
            <Link 
              href="/#samples" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-charcoal/80"
            >
              Sample Albums
            </Link>
            <Link 
              href="/#plans" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-charcoal/80"
            >
              Pricing
            </Link>
            <Link 
              href="/#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-charcoal/80"
            >
              FAQ
            </Link>
            {currentUser && (
              <>
                {currentUser.role === "user" && (
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-charcoal/80"
                  >
                    My Dashboard
                  </Link>
                )}
                {currentUser.role === "admin" && (
                  <Link 
                    href="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-base font-medium text-charcoal/60"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </>
            )}
          </nav>
          
          <div className="pt-4 border-t border-moss-green/10 flex flex-col gap-3">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/albums/new");
                  }}
                  className="w-full flex h-10 items-center justify-center rounded-lg bg-forest-green text-sm font-semibold text-warm-white shadow-premium"
                >
                  Create Your Story
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    router.push("/");
                  }}
                  className="w-full flex h-10 items-center justify-center rounded-lg border border-red-200 text-sm font-semibold text-red-600 bg-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-10 items-center justify-center rounded-lg border border-forest-green/20 text-sm font-semibold text-forest-green bg-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-10 items-center justify-center rounded-lg bg-forest-green text-sm font-semibold text-warm-white shadow-premium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
