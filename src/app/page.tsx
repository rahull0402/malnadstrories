"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { 
  ArrowRight, 
  Upload, 
  BookOpen, 
  MapPin, 
  CheckCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronRight,
  Book,
  Camera,
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const { albums } = useApp();
  
  // States for interactive components on the page
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedSampleAlbum, setSelectedSampleAlbum] = useState<string | null>(null);
  const [samplePage, setSamplePage] = useState<number>(0);
  
  // Custom scroll triggers state placeholder
  useEffect(() => {
    // Hooks reserved for future GSAP scroll triggers:
    // gsap.registerPlugin(ScrollTrigger);
    // const tl = gsap.timeline({ scrollTrigger: { trigger: "#hero", ... } });
    console.log("GSAP / Scroll-triggered storytelling hooks initialized.");
  }, []);

  const sampleAlbumsData = [
    {
      id: "chikmagalur",
      title: "Chikmagalur Coffee Trails",
      destination: "Mullayanagiri & Estates",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
      color: "#1F4D3A",
      pages: [
        { title: "Coffee Trails", text: "Deep inside the misty coffee valleys, the scent of fresh cardamom and wet earth filled the air.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800" },
        { title: "Mullayanagiri Ascent", text: "As the sun broke, we climbed the 200 stone steps to the peak. The clouds rolled beneath us.", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" },
        { title: "Hebbe Falls", text: "A hidden pool of glacial water, crashing through towering green ferns.", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800" }
      ]
    },
    {
      id: "coorg",
      title: "Monsoon in Coorg",
      destination: "Madikeri & Valleys",
      coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
      color: "#2D5A3D",
      pages: [
        { title: "Rain-soaked Hills", text: "Coorg in July is an endless ocean of emerald hills, washed clean by heavy monsoon currents.", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800" },
        { title: "Spices & Streams", text: "Walking past clove estates, where streams carved cold pathways through ancient basalt boulders.", img: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800" }
      ]
    }
  ];

  const destinations = [
    { name: "Chikmagalur", desc: "Misty estates & peaks", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600" },
    { name: "Coorg", desc: "Emerald spice valleys", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600" },
    { name: "Gokarna", desc: "Cliffs meeting the sea", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" },
    { name: "Kashmir", desc: "Alpine lakes & mists", img: "https://images.unsplash.com/photo-1595954421288-adc3e2104005?q=80&w=600" },
    { name: "Leh", desc: "Highlands of sand & ice", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600" },
    { name: "Manali", desc: "Glacial rivers & cedar", img: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600" }
  ];

  const plans = [
    { name: "Starter", pages: "24 Pages", desc: "Perfect for weekend getaways and small treks.", price: "₹1,499", features: ["Linen Cover Option", "Archival Quality Paper", "Standard Delivery Included", "24 High-Res Pages"] },
    { name: "Explorer", pages: "36 Pages", desc: "Best for week-long Himalayan excursions or road trips.", price: "₹2,499", popular: true, features: ["Custom Hardcover Premium", "Heavy Uncoated Archival Paper", "Dedicated Page Designer", "36 Custom Laid Pages", "AI Text Captions Assistant"] },
    { name: "Adventure", pages: "50 Pages", desc: "A definitive volume to cover a major chapter of life.", price: "₹3,499", features: ["Clad Leather or Hardcover Premium", "Archival Lay-flat Premium Paper", "Priority Printing & Processing", "50 Page Story Spread", "Dual-destination Mapping"] }
  ];

  const testimonials = [
    { name: "Meera K.", trip: "Chikmagalur Hills", quote: "My coffee trail photos were sitting in a WhatsApp group folder. Having them bound in this forest-green book feels like holding a piece of history. The lay-flat binding is stunning." },
    { name: "Rohan Sen", trip: "Gokarna Beaches", quote: "National Geographic vibes. Seriously. The typography styling, the matte uncoated sheets—this is a design object on my table, not just a photo-album." },
    { name: "Shreya Ghoshal", trip: "Kashmir Valley", quote: "The uploader was simple and the auto-generation laid out the misty Dal Lake photos beautifully. I ordered three copies for my family." }
  ];

  const faqs = [
    { q: "How is the print quality compared to standard photo books?", a: "Unlike glossy, commercial photo albums, Malnad Stories uses heavy-weight uncoated archival papers with a natural matte finish, similar to premium travel journals. The cover is bound in high-density textured board or linen cloth, pressed with gold-sand foil detailing." },
    { q: "Can I customize the layouts myself or is it automated?", a: "We support three builder options: fully automatic generation (AI sequences photos by time/colors), manual composition (drag-and-drop with alignment tools), and a hybrid builder where you start automated and tweak specific page spreads." },
    { q: "How long does printing and delivery take?", a: "Each book is individually printed, inspected, and hand-wrapped in our Malnad studio. Production takes 3-4 working days, and tracked shipping takes 3-5 days to deliver across major Indian cities." },
    { q: "What resolution should my travel photographs be?", a: "Modern mobile phone photos (12MP+) work beautifully. Our builder automatically checks your images and flags any low-resolution assets to ensure crystal-clear prints." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section id="hero" className="relative overflow-hidden min-h-[92vh] flex items-center justify-center py-20 px-4">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-moss-green/10 via-warm-white to-warm-white -z-20" />
        
        {/* SVG Mountains Overlay and Leaf Particles */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] select-none -z-10 opacity-40">
          <svg viewBox="0 0 1440 320" className="w-full h-auto text-forest-green/5 fill-current">
            <path d="M0,224L120,192C240,160,480,96,720,96C960,96,1200,160,1320,192L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
          </svg>
        </div>

        {/* Floating Leaves (Micro-animations) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="leaf-fall text-forest-green/10" style={{ left: "15%", animationDelay: "0s", animationDuration: "12s" }}>🍃</div>
          <div className="leaf-fall text-forest-green/10" style={{ left: "45%", animationDelay: "2s", animationDuration: "9s" }}>🍁</div>
          <div className="leaf-fall text-forest-green/10" style={{ left: "80%", animationDelay: "4s", animationDuration: "14s" }}>🍃</div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest-green/20 bg-forest-green/5 text-forest-green text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Memory Preservation
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest-green leading-[1.1]">
              Your Journey Deserves More Than a Gallery
            </h1>
            
            <p className="text-lg text-charcoal/80 max-w-lg">
              Transform your adventures into beautifully crafted, hard-bound storybooks. Designed with Apple-level simplicity, built to stand the test of generations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <button 
                onClick={() => router.push("/albums/new")}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-forest-green px-8 text-sm font-semibold text-warm-white shadow-premium transition-all duration-300 hover:bg-moss-green hover:-translate-y-0.5"
              >
                Create Your Story
              </button>
              <a 
                href="#samples"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-moss-green/20 bg-warm-white/50 px-8 text-sm font-semibold text-forest-green hover:bg-moss-green/5 hover:border-moss-green/30 transition-colors"
              >
                Explore Sample Albums
              </a>
            </div>
          </div>

          {/* Reserved / Placeholder architecture for Floating Premium Book with dynamic perspective */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="relative w-72 sm:w-96 aspect-[3/4] rounded-r-xl shadow-premium border-y border-r border-forest-green/10 bg-forest-green overflow-hidden cursor-pointer group"
              onClick={() => {
                setSelectedSampleAlbum("chikmagalur");
                setSamplePage(0);
              }}
            >
              {/* Photorealistic Hardcover texture */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(255,255,255,0.15),_transparent)] mix-blend-overlay" />
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/30 shadow-[inset_-2px_0_4px_rgba(255,255,255,0.1)] z-10" />
              
              <div className="h-full flex flex-col justify-between p-8 text-warm-white relative">
                {/* Book Title Details */}
                <div className="space-y-2 mt-12">
                  <span className="text-[10px] uppercase tracking-widest text-accent-sand font-bold">Volume I</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">Chikmagalur Coffee Trails</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border-t border-warm-white/20 pt-4">
                    <p className="text-xs text-warm-white/70">MULLAYANAGIRI & COFFEE TRAILS</p>
                    <p className="text-[10px] text-accent-sand uppercase tracking-wider font-semibold">MALNAD STORIES STUDIO</p>
                  </div>
                  
                  {/* Subtle click-to-open indicator */}
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-accent-sand group-hover:underline">
                    Flip Open Sample <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST BAR */}
      <section className="bg-forest-green text-warm-white/90 py-6 border-y border-accent-sand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-accent-sand/10">
            <div className="flex flex-col justify-center py-2 md:py-0">
              <span className="text-xl font-serif font-bold text-accent-sand">10,000+</span>
              <span className="text-xs uppercase tracking-wider text-warm-white/70">Memories Preserved</span>
            </div>
            <div className="flex flex-col justify-center py-2 md:py-0">
              <span className="text-xl font-serif font-bold text-accent-sand">500+</span>
              <span className="text-xs uppercase tracking-wider text-warm-white/70">Destinations Captured</span>
            </div>
            <div className="flex flex-col justify-center py-2 md:py-0">
              <span className="text-xl font-serif font-bold text-accent-sand">Fine Art Print</span>
              <span className="text-xs uppercase tracking-wider text-warm-white/70">Premium Quality</span>
            </div>
            <div className="flex flex-col justify-center py-2 md:py-0">
              <span className="text-xl font-serif font-bold text-accent-sand">Pan India</span>
              <span className="text-xs uppercase tracking-wider text-warm-white/70">Delivered Safely</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — STORYTELLING EXPERIENCE */}
      <section id="story" className="py-24 px-4 bg-warm-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">The Preservation Journey</h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green">How Your Travel Becomes Literature</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Step 1: Capture */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-forest-green/5 rounded-2xl border border-forest-green/10">
              <div className="h-14 w-14 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green mb-2">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-green">1. Capture</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                Photograph your wilderness travels, local routes, and forest trails. Drop your image folder into our local-storageIndexedDB uploader.
              </p>
            </div>

            {/* Step 2: Design */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-forest-green/5 rounded-2xl border border-forest-green/10">
              <div className="h-14 w-14 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green mb-2">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-green">2. Design</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                Use our photorealistic album editor. Arrange pages with customizable layouts, crop images, write travel notes, or trigger our automated AI Story Assistant.
              </p>
            </div>

            {/* Step 3: Relive */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-forest-green/5 rounded-2xl border border-forest-green/10">
              <div className="h-14 w-14 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green mb-2">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-green">3. Relive</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                Receive your printed masterpiece. Flat lay-binding, textured covers, and museum-grade printing delivered straight from the Western Ghats to your shelf.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURED DESTINATIONS */}
      <section id="destinations" className="py-24 px-4 bg-forest-green/5 border-y border-forest-green/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">Stories from the Hills</h2>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green mt-1">Featured Destinations</p>
            </div>
            <p className="text-sm text-charcoal/70 max-w-md">
              Every route has its own colored spine representing the geographic temperature, vegetation, and flora of the trip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <div 
                key={i} 
                className="group relative h-96 rounded-xl overflow-hidden shadow-premium bg-charcoal cursor-pointer"
                onClick={() => {
                  router.push(`/albums/new?destination=${dest.name}`);
                }}
              >
                {/* Image backdrop */}
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Bottom metadata details */}
                <div className="absolute bottom-6 left-6 right-6 text-warm-white flex flex-col">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-accent-sand tracking-widest mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>Western Ghats</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{dest.name}</h3>
                  <p className="text-xs text-warm-white/70 mt-1">{dest.desc}</p>
                  
                  <span className="mt-4 text-xs font-semibold text-accent-sand opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Start Storybook <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — SAMPLE ALBUMS */}
      <section id="samples" className="py-24 px-4 bg-warm-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">Finely Crafted Volumes</h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green">Explore Sample Spreads</p>
            <p className="text-sm text-charcoal/70">
              Flip through restricted mockups of our most popular designs before you order yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {sampleAlbumsData.map((album) => (
              <div 
                key={album.id} 
                className="bg-forest-green/5 border border-forest-green/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Miniature Album Cover Cover */}
                <div 
                  className="w-48 aspect-[3/4] rounded-r-lg shadow-book flex flex-col justify-between p-6 text-warm-white relative cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: album.color }}
                  onClick={() => {
                    setSelectedSampleAlbum(album.id);
                    setSamplePage(0);
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(255,255,255,0.1),_transparent)] mix-blend-overlay" />
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/20" />
                  
                  <div className="text-left mt-6">
                    <span className="text-[8px] uppercase tracking-widest text-accent-sand font-bold">Premium Edition</span>
                    <h4 className="font-serif text-lg font-bold leading-tight">{album.title}</h4>
                  </div>
                  <div className="text-left text-[9px] border-t border-warm-white/10 pt-2">
                    {album.destination}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-forest-green">{album.title}</h3>
                  <p className="text-xs text-charcoal/70">{album.destination} • 36 Pages • Uncoated stock</p>
                </div>

                <button 
                  onClick={() => {
                    setSelectedSampleAlbum(album.id);
                    setSamplePage(0);
                  }}
                  className="h-10 px-6 rounded-lg border border-forest-green/20 text-xs font-bold text-forest-green bg-warm-white shadow-sm hover:bg-forest-green/5 transition-colors"
                >
                  Browse Sample Spreads
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE ALBUM MODAL (Restricted previews) */}
      <AnimatePresence>
        {selectedSampleAlbum && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-warm-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-premium relative flex flex-col max-h-[90vh]"
            >
              {/* Top Details */}
              <div className="p-4 sm:p-6 border-b border-moss-green/10 flex justify-between items-center bg-forest-green text-warm-white">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-accent-sand font-bold">Archival Album Preview</span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold">
                    {sampleAlbumsData.find(a => a.id === selectedSampleAlbum)?.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedSampleAlbum(null)}
                  className="h-8 w-8 rounded-full border border-warm-white/20 hover:bg-warm-white/10 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Book Page Viewer Canvas */}
              <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center items-center overflow-y-auto">
                {/* Photorealistic double page spread */}
                <div className="w-full max-w-3xl aspect-[1.6/1] bg-white rounded-lg shadow-book relative flex overflow-hidden border border-charcoal/5">
                  
                  {/* Left Page */}
                  <div className="w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF9F6] border-r border-charcoal/5 relative">
                    <div className="absolute inset-y-0 right-0 w-6 book-page-shadow-left" />
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase text-accent-sand font-semibold">
                        Page {samplePage * 2 + 1}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-forest-green leading-snug">
                        {sampleAlbumsData.find(a => a.id === selectedSampleAlbum)?.pages[samplePage]?.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-serif italic">
                        {sampleAlbumsData.find(a => a.id === selectedSampleAlbum)?.pages[samplePage]?.text}
                      </p>
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-charcoal/40 font-mono">
                      MALNAD STORIES PRINT
                    </div>
                  </div>

                  {/* Spine Center Shader */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 book-spine-shadow z-10" />

                  {/* Right Page */}
                  <div className="w-1/2 bg-[#FAF9F6] p-4 flex flex-col justify-between relative">
                    <div className="absolute inset-y-0 left-0 w-6 book-page-shadow-right" />
                    <div className="w-full h-full rounded-md overflow-hidden bg-charcoal/5 flex items-center justify-center relative">
                      <img 
                        src={sampleAlbumsData.find(a => a.id === selectedSampleAlbum)?.pages[samplePage]?.img} 
                        alt="Sample Spread Image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Flip Page Navigator */}
                <div className="flex gap-4 mt-8 items-center">
                  <button 
                    disabled={samplePage === 0}
                    onClick={() => setSamplePage(p => p - 1)}
                    className="h-8 px-4 rounded border border-moss-green/20 text-xs font-semibold text-forest-green disabled:opacity-30"
                  >
                    Previous Spread
                  </button>
                  <span className="text-xs text-charcoal/60">
                    Spread {samplePage + 1} of {sampleAlbumsData.find(a => a.id === selectedSampleAlbum)?.pages.length}
                  </span>
                  <button 
                    disabled={samplePage === (sampleAlbumsData.find(a => a.id === selectedSampleAlbum)?.pages.length || 1) - 1}
                    onClick={() => setSamplePage(p => p + 1)}
                    className="h-8 px-4 rounded border border-moss-green/20 text-xs font-semibold text-forest-green disabled:opacity-30"
                  >
                    Next Spread
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-forest-green/5 border-t border-moss-green/10 flex justify-between items-center px-6">
                <span className="text-xs text-charcoal/60">Demo preview. All album printing is custom.</span>
                <button
                  onClick={() => {
                    setSelectedSampleAlbum(null);
                    router.push("/albums/new");
                  }}
                  className="h-10 px-6 rounded-lg bg-forest-green text-xs font-bold text-warm-white shadow-premium hover:bg-moss-green"
                >
                  Start Your Own Book
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 6 — HOW IT WORKS */}
      <section className="py-24 px-4 bg-forest-green/5 border-y border-forest-green/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">The Craft Process</h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green">4 Steps to Your Printed Legacy</p>
          </div>

          <div className="relative border-l border-forest-green/20 ml-4 md:ml-32 space-y-12">
            {[
              { n: "01", title: "Upload Travel Photos", desc: "Select high-resolution images. Our local-storage uploader processes them directly in your browser." },
              { n: "02", title: "Build Your Storybook", desc: "Sequence pages chronologically. Use templates to match single landscape shots or grid arrangements." },
              { n: "03", title: "Customize Layouts & Captions", desc: "Select typography margins, write descriptions or invoke our AI Assistant to generate custom journal text." },
              { n: "04", title: "Receive Hand-bound Edition", desc: "We press, print, bind, and package your travel story using natural materials in our Malnad workshop." }
            ].map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Circular indicator */}
                <div className="absolute -left-[17px] top-0 h-8 w-8 rounded-full border border-forest-green/20 bg-warm-white text-forest-green font-bold text-xs flex items-center justify-center shadow-sm">
                  {step.n}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-forest-green">{step.title}</h3>
                  <p className="text-sm text-charcoal/80 max-w-xl">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — PLANS */}
      <section id="plans" className="py-24 px-4 bg-warm-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">Simple Archival Pricing</h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green">Choose Your Travel Format</p>
            <p className="text-sm text-charcoal/70">
              Uncoated papers, lay-flat designs, and custom cover options included in all tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative bg-warm-white border rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular 
                    ? "border-forest-green shadow-premium scale-105 md:scale-102 lg:scale-105 z-10" 
                    : "border-moss-green/10 hover:border-moss-green/30 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-forest-green text-warm-white text-[10px] font-bold tracking-widest uppercase py-1 px-4 rounded-full border border-accent-sand/40">
                    Most Selected
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-accent-sand uppercase tracking-widest">{plan.name}</h3>
                    <h4 className="font-serif text-2xl font-bold text-forest-green mt-1">{plan.pages}</h4>
                    <p className="text-xs text-charcoal/60 mt-1">{plan.desc}</p>
                  </div>
                  
                  <div className="py-4 border-y border-moss-green/10">
                    <span className="text-4xl font-serif font-bold text-forest-green">{plan.price}</span>
                    <span className="text-xs text-charcoal/60"> / printed book</span>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-charcoal/80">
                        <CheckCircle className="h-4 w-4 text-forest-green shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => router.push(`/albums/new?plan=${plan.name}`)}
                  className={`mt-8 w-full h-11 rounded-lg text-xs font-bold transition-all duration-300 ${
                    plan.popular
                      ? "bg-forest-green text-warm-white shadow-premium hover:bg-moss-green"
                      : "border border-forest-green/20 text-forest-green hover:bg-forest-green/5"
                  }`}
                >
                  Start This Album
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — TESTIMONIALS */}
      <section className="py-24 px-4 bg-forest-green/5 border-y border-forest-green/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">Shared Legacies</h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green">Explorer Diaries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-warm-white p-6 rounded-2xl border border-moss-green/10 shadow-sm flex flex-col justify-between">
                <p className="text-sm text-charcoal/80 leading-relaxed font-serif italic mb-6">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-serif font-bold text-forest-green">{test.name}</h4>
                  <span className="text-[10px] uppercase tracking-wider text-accent-sand font-semibold">{test.trip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FAQ */}
      <section id="faq" className="py-24 px-4 bg-warm-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent-sand">Common Inquiries</h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-forest-green">Preservation details</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-moss-green/10 pb-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-left font-serif text-lg font-bold text-forest-green focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {activeFaq === i ? <ChevronDown className="h-5 w-5 text-accent-sand" /> : <ChevronRight className="h-5 w-5 text-accent-sand" />}
                </button>
                
                {activeFaq === i && (
                  <p className="mt-2 text-sm text-charcoal/80 leading-relaxed pl-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section className="relative py-32 px-4 bg-forest-green text-warm-white text-center overflow-hidden">
        {/* Dynamic backdrop shading */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(212,163,115,0.1),_transparent)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Every journey ends. <br />
            <span className="text-accent-sand italic">Your story shouldn&apos;t.</span>
          </h2>
          
          <p className="text-warm-white/70 max-w-md mx-auto text-sm sm:text-base">
            Transform those heavy files sitting on your phone into printed keepsakes. Keep the coffee mist on your shelf.
          </p>

          <button
            onClick={() => router.push("/albums/new")}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-warm-white px-8 text-sm font-bold text-forest-green shadow-premium transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Create Your Story
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal text-warm-white/40 py-12 px-4 border-t border-warm-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Malnad Stories Logo" className="h-8 w-8 object-contain" />
            <div className="flex flex-col items-start">
              <span className="font-serif text-base font-bold text-warm-white leading-snug">Malnad Stories</span>
              <span className="text-[9px] uppercase tracking-widest text-accent-sand font-semibold -mt-1">Studio & Bindery</span>
            </div>
          </div>
          <div className="flex gap-8 text-xs">
            <Link href="/#story" className="hover:text-warm-white">Preservation</Link>
            <Link href="/#destinations" className="hover:text-warm-white">Destinations</Link>
            <Link href="/#plans" className="hover:text-warm-white">Pricing</Link>
            <Link href="/admin" className="hover:text-warm-white">Admin</Link>
          </div>
          <p className="text-[10px]">© 2026 Malnad Stories. All travel preservation is bound to heart.</p>
        </div>
      </footer>
    </div>
  );
}
