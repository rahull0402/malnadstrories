"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlbumPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { albums, setActiveAlbum } = useApp();
  
  const albumId = params.id as string;
  const album = albums.find(a => a.id === albumId) || null;
  const [currentPage, setCurrentPage] = useState(-1); // -1 = Cover Front, pages.length/2 = Cover Back

  if (!album) {
    return (
      <div className="flex h-screen items-center justify-center bg-charcoal text-warm-white">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-4 border-accent-sand border-t-transparent animate-spin mx-auto" />
          <p className="text-sm">Preparing book preview theater...</p>
        </div>
      </div>
    );
  }

  const pages = album.pages || [];
  const totalSpreads = Math.floor(pages.length / 2);

  const handleNextPage = () => {
    if (currentPage < totalSpreads) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > -1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex flex-col justify-between text-warm-white select-none">
      
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-warm-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/albums/${album.id}/build`)}
            className="p-2 hover:bg-white/5 rounded-lg text-warm-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-sm font-bold tracking-tight text-accent-sand">{album.title}</h1>
            <p className="text-[10px] text-warm-white/40 uppercase tracking-widest font-semibold mt-0.5">
              Archival Proof Preview
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/albums/${album.id}/build`)}
            className="h-9 px-4 rounded-lg border border-warm-white/20 text-xs font-semibold hover:bg-white/5"
          >
            Return to Editor
          </button>
          <button
            onClick={() => router.push(`/checkout/${album.id}`)}
            className="h-9 px-5 rounded-lg bg-accent-sand text-xs font-bold text-forest-green hover:bg-accent-sand/90 flex items-center gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Confirm & Order</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Dynamic page background mists */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03),_transparent)] pointer-events-none" />

        <div className="w-full max-w-4xl flex justify-center items-center">
          
          <AnimatePresence mode="wait">
            {/* FRONT COVER */}
            {currentPage === -1 && (
              <motion.div
                key="front-cover"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.6 }}
                onClick={handleNextPage}
                className="w-72 sm:w-96 aspect-[3/4] rounded-r-2xl shadow-book relative bg-forest-green border-y border-r border-warm-white/10 flex flex-col justify-between p-10 cursor-pointer overflow-hidden group select-none"
                style={{ backgroundColor: album.coverColor }}
              >
                {/* Texture effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(255,255,255,0.15),_transparent)] mix-blend-overlay" />
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/35 shadow-[inset_-2px_0_4px_rgba(255,255,255,0.1)]" />
                
                <div className="mt-12 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-accent-sand font-bold">Limited Pressing</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-warm-white">
                    {album.coverTitle || album.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-xs text-warm-white/70 uppercase tracking-widest border-t border-warm-white/10 pt-4">
                    {album.coverSubtitle || album.destination}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-accent-sand group-hover:underline">
                    <span>Open Storybook</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.div>
            )}

            {/* DOUBLE SPREAD PAGES */}
            {currentPage >= 0 && currentPage < totalSpreads && (
              <motion.div
                key={`spread-${currentPage}`}
                initial={{ rotateY: -30, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl aspect-[1.6/1] bg-white rounded-lg shadow-book relative flex overflow-hidden border border-black/20"
              >
                {/* Left Page */}
                <div className="w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-[#FAF9F6] border-r border-black/10 relative">
                  <div className="absolute inset-y-0 right-0 w-8 book-page-shadow-left" />
                  <div className="space-y-4">
                    <span className="text-[9px] uppercase tracking-wider text-accent-sand font-bold">
                      Page {currentPage * 2 + 1}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-forest-green">
                      {pages[currentPage * 2]?.title || "Chapter Spread"}
                    </h3>
                    <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-serif italic">
                      {pages[currentPage * 2]?.text || "A blank storybook page waiting to be filled..."}
                    </p>
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-charcoal/40 font-mono">
                    Malnad Stories Studio Proof
                  </div>
                </div>

                {/* Spine shadows */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 book-spine-shadow z-10" />

                {/* Right Page */}
                <div className="w-1/2 bg-[#FAF9F6] p-4 flex flex-col justify-between relative">
                  <div className="absolute inset-y-0 left-0 w-8 book-page-shadow-right" />
                  <div className="w-full h-full rounded-md overflow-hidden bg-charcoal/5 flex items-center justify-center relative shadow-inner">
                    {pages[currentPage * 2 + 1]?.images[0] ? (
                      <img 
                        src={pages[currentPage * 2 + 1]?.images[0]} 
                        alt="Preview Right Page" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-charcoal/30 flex flex-col items-center">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-[9px] mt-1">Empty Page</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* BACK COVER */}
            {currentPage === totalSpreads && (
              <motion.div
                key="back-cover"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => setCurrentPage(-1)}
                className="w-72 sm:w-96 aspect-[3/4] rounded-l-2xl shadow-book relative bg-forest-green border-y border-l border-warm-white/10 flex flex-col justify-between p-10 cursor-pointer overflow-hidden select-none"
                style={{ backgroundColor: album.coverColor }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.1),_transparent)] mix-blend-overlay" />
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-black/35 shadow-[inset_2px_0_4px_rgba(255,255,255,0.1)]" />
                
                <div className="mt-12 flex justify-center text-center">
                  <div className="h-14 w-14 rounded-full bg-warm-white/10 flex items-center justify-center text-accent-sand">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>

                <div className="text-center border-t border-warm-white/10 pt-6 space-y-4">
                  <p className="text-[9px] uppercase tracking-widest text-accent-sand font-bold">
                    Malnad Stories Studio
                  </p>
                  <p className="text-[9px] text-warm-white/50">
                    Hand-printed and bound in natural fibers. Made in India.
                  </p>
                  <span className="text-[9px] text-accent-sand underline block">
                    Click to flip to start
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Page navigator bar */}
        <div className="flex items-center gap-6 mt-10">
          <button 
            disabled={currentPage === -1}
            onClick={handlePrevPage}
            className="h-10 w-10 rounded-full border border-warm-white/20 hover:bg-white/15 flex items-center justify-center text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-xs text-warm-white/60">
            {currentPage === -1 && "Front Cover"}
            {currentPage >= 0 && currentPage < totalSpreads && `Spread ${currentPage + 1} of ${totalSpreads}`}
            {currentPage === totalSpreads && "Back Cover"}
          </span>

          <button 
            disabled={currentPage === totalSpreads}
            onClick={handleNextPage}
            className="h-10 w-10 rounded-full border border-warm-white/20 hover:bg-white/15 flex items-center justify-center text-white disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </main>

      {/* Warning banner */}
      <footer className="h-14 px-6 border-t border-warm-white/10 bg-black/20 flex items-center justify-center text-xs text-warm-white/40">
        📌 Please review titles, spelling, and image crops. Your book will print exactly as shown in this proof.
      </footer>
    </div>
  );
}
