"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, Album } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { 
  Plus, 
  BookOpen, 
  Camera, 
  MapPin, 
  Trash2, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  TrendingUp, 
  Gift, 
  Wand2 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { albums, orders, currentUser, deleteAlbum, setActiveAlbum, loading } = useApp();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/login");
      } else if (currentUser.role !== "user") {
        router.push("/admin");
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <div className="text-forest-green font-serif text-lg animate-pulse">Loading workspace...</div>
      </div>
    );
  }

  const handleCreateNew = () => {
    router.push("/albums/new");
  };

  const handleResumeBuild = (album: Album) => {
    setActiveAlbum(album);
    router.push(`/albums/${album.id}/build`);
  };

  const handlePreviewAlbum = (album: Album) => {
    setActiveAlbum(album);
    router.push(`/albums/${album.id}/preview`);
  };

  const confirmDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this travel story? All layout drafts and local photos will be permanently deleted.")) {
      deleteAlbum(id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-moss-green/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-sand">Traveler Workspace</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-green mt-1">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-sm text-charcoal/60 mt-1">
              Your stories are bound in your private workspace.
            </p>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-forest-green px-6 text-sm font-semibold text-warm-white shadow-premium hover:bg-moss-green hover:-translate-y-0.5 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Travel Story</span>
          </button>
        </div>

        {/* SECTION: EMOTIONAL STATISTICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1: Albums Created */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Storybooks Bound</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">{albums.length}</h3>
              <p className="text-[10px] text-charcoal/50">1 completed, {albums.length - 1} draft</p>
            </div>
          </div>

          {/* Stat 2: Memories Uploaded */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Memories Preserved</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">
                {currentUser?.memoriesUploadedCount}
              </h3>
              <p className="text-[10px] text-charcoal/50">High-resolution assets</p>
            </div>
          </div>

          {/* Stat 3: Destinations Explored */}
          <div className="bg-[#FAF9F6] border border-moss-green/10 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-forest-green/5 text-forest-green flex items-center justify-center shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">Pins on Spine Map</span>
              <h3 className="font-serif text-2xl font-bold text-forest-green mt-0.5">
                {currentUser?.destinationsExplored.length}
              </h3>
              <p className="text-[10px] text-charcoal/50">{currentUser?.destinationsExplored.join(", ")}</p>
            </div>
          </div>

          {/* Stat 4: Milestone Progress */}
          <div className="bg-forest-green text-warm-white p-6 rounded-2xl flex flex-col justify-between shadow-premium border border-accent-sand/20">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-widest text-accent-sand font-bold">Milestone Tracker</span>
              <TrendingUp className="h-4 w-4 text-accent-sand" />
            </div>
            <div className="mt-2">
              <h4 className="font-serif text-sm font-bold">Himalayan Chapter</h4>
              <p className="text-[10px] text-warm-white/70 mt-0.5">Upload 50 photos to unlock free sand-foil engraving.</p>
            </div>
            {/* Progress bar */}
            <div className="mt-3 w-full bg-warm-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-accent-sand h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, ((currentUser?.memoriesUploadedCount || 0) / 50) * 100)}%` }} 
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: ALBUM LIST (Draft & Preloaded Demo) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold text-forest-green">Active Travel Journals</h2>
              <span className="text-xs text-charcoal/50">{albums.length} journals in storage</span>
            </div>

            {albums.length === 0 ? (
              <div className="border border-dashed border-moss-green/20 rounded-2xl p-12 text-center bg-forest-green/5 space-y-4">
                <BookOpen className="h-10 w-10 text-forest-green/30 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-forest-green">No Storybooks Yet</h3>
                  <p className="text-sm text-charcoal/60 max-w-sm mx-auto">
                    Preserve your recent wanderings by building a hardcover photobook.
                  </p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="h-10 px-6 rounded-lg bg-forest-green text-xs font-bold text-warm-white shadow-premium"
                >
                  Create Storybook
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {albums.map((album) => (
                  <div 
                    key={album.id} 
                    className="group bg-[#FAF9F6] border border-moss-green/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Cover Preview container */}
                    <div className="h-44 relative bg-charcoal flex items-center justify-center p-4">
                      {album.coverImage ? (
                        <img 
                          src={album.coverImage} 
                          alt={album.title} 
                          className="absolute inset-0 h-full w-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-forest-green opacity-80" />
                      )}
                      {/* Linear gradient shade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                      
                      {/* Absolute Demo label */}
                      {album.isDemo && (
                        <span className="absolute top-3 left-3 bg-accent-sand text-forest-green text-[9px] font-bold tracking-widest uppercase py-0.5 px-2.5 rounded-full border border-forest-green/20">
                          Preloaded Demo
                        </span>
                      )}

                      {/* Small book mockup float on hover */}
                      <div className="absolute bottom-4 left-4 right-4 text-warm-white flex items-end justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-accent-sand font-bold">
                            {album.plan} Plan • {album.pageCount} Pages
                          </span>
                          <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-accent-sand transition-colors">
                            {album.title}
                          </h3>
                        </div>
                        <span className="text-[10px] text-warm-white/70 italic flex items-center gap-0.5">
                          {album.destination}
                        </span>
                      </div>
                    </div>

                    {/* Meta & Actions */}
                    <div className="p-5 space-y-4 bg-white flex-1 flex flex-col justify-between">
                      <p className="text-xs text-charcoal/70 line-clamp-2 italic font-serif">
                        &ldquo;{album.description || "A blank storybook waiting for travel memories."}&rdquo;
                      </p>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-moss-green/5">
                        <span className="text-[10px] text-charcoal/40 font-mono">
                          Created: {new Date(album.createdAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex gap-2.5 items-center">
                          <button
                            onClick={() => confirmDelete(album.id)}
                            className="p-1.5 text-charcoal/40 hover:text-red-600 transition-colors"
                            title="Delete Draft"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handlePreviewAlbum(album)}
                            className="text-xs font-bold text-forest-green hover:underline"
                          >
                            Preview
                          </button>

                          <button
                            onClick={() => handleResumeBuild(album)}
                            className="h-8 px-4 rounded-lg bg-forest-green text-xs font-bold text-warm-white shadow-sm hover:bg-moss-green flex items-center gap-1"
                          >
                            <span>Edit</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR: QUICK ACTIONS & RECENT ORDERS */}
          <section className="lg:col-span-4 space-y-8">
            {/* Quick Actions Panel */}
            <div className="bg-[#FAF9F6] border border-moss-green/10 rounded-2xl p-6 space-y-5 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-forest-green">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCreateNew}
                  className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-forest-green/5 border border-moss-green/5 hover:border-moss-green/10 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-forest-green/5 text-forest-green flex items-center justify-center">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-forest-green">Start New Album</h4>
                      <p className="text-[10px] text-charcoal/50">Initialize a custom layout wizard</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-forest-green/45" />
                </button>

                <button 
                  onClick={() => alert("Material Sample kit includes linen fabrics, uncoated fine-art paper swatches, and foil layout samples. Free shipment dispatched.")}
                  className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-forest-green/5 border border-moss-green/5 hover:border-moss-green/10 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-forest-green/5 text-forest-green flex items-center justify-center">
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-forest-green">Order Sample Swatches</h4>
                      <p className="text-[10px] text-charcoal/50">Request printed paper & linen samples</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-forest-green/45" />
                </button>

                <button 
                  onClick={() => alert("AI assistant layout generation is active inside the Album Builder.")}
                  className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-forest-green/5 border border-moss-green/5 hover:border-moss-green/10 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-forest-green/5 text-forest-green flex items-center justify-center">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-forest-green">AI Title Helper</h4>
                      <p className="text-[10px] text-charcoal/50">Generate captions & titles automatically</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-forest-green/45" />
                </button>
              </div>
            </div>

            {/* Completed Orders / Tracking Timeline */}
            <div className="bg-[#FAF9F6] border border-moss-green/10 rounded-2xl p-6 space-y-5 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-forest-green">Recent Orders</h3>
                <Clock className="h-4 w-4 text-charcoal/30" />
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-charcoal/50 text-center py-4">No printing orders placed yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 bg-white border border-moss-green/5 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-bold text-accent-sand uppercase tracking-wider">
                            Order {order.id}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-forest-green line-clamp-1">
                            {order.albumTitle}
                          </h4>
                          <p className="text-[9px] text-charcoal/50 mt-0.5">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          order.status === "Delivered" 
                            ? "bg-green-100 text-green-800" 
                            : order.status === "Printing" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-moss-green/5">
                        <span className="text-xs font-bold text-forest-green">₹{order.amount}</span>
                        <Link 
                          href={`/orders/${order.id}`}
                          className="text-[10px] font-bold text-accent-sand uppercase tracking-wider hover:underline flex items-center gap-0.5"
                        >
                          <span>Track Production</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
