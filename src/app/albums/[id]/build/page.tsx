"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp, Album, BookPage, PhotoAsset } from "@/context/AppContext";
import { 
  ArrowLeft, 
  Eye, 
  ShoppingCart, 
  RotateCcw, 
  RotateCw, 
  Upload, 
  Layout, 
  Type, 
  Palette, 
  Wand2, 
  Sparkles, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Trash2,
  Sliders,
  Crop,
  Check,
  HelpCircle,
  FolderOpen,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlbumBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const { albums, updateAlbum, addPhotoToIndexedDB } = useApp();
  
  const albumId = params.id as string;
  const [album, setAlbum] = useState<Album | null>(null);
  
  // Builder panel states
  const [activeTab, setActiveTab] = useState<"uploads" | "templates" | "backgrounds" | "ai">("uploads");
  const [selectedElement, setSelectedElement] = useState<{ pageId: string; type: "image" | "text" | "title"; imgIndex?: number } | null>(null);
  const [activeSpreadIndex, setActiveSpreadIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("saved");
  
  // History states for Undo/Redo
  const [history, setHistory] = useState<BookPage[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // AI assistant loading state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  // Load Album
  useEffect(() => {
    if (!album || album.id !== albumId) {
      const found = albums.find(a => a.id === albumId);
      if (found) {
        setTimeout(() => {
          setAlbum(found);
          // Initialize editing history
          if (found.pages && found.pages.length > 0) {
            setHistory([JSON.parse(JSON.stringify(found.pages))]);
            setHistoryIndex(0);
          }
        }, 0);
      }
    }
  }, [albumId, albums, album]);


  if (!album) {
    return (
      <div className="flex h-screen items-center justify-center bg-warm-white">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-4 border-forest-green border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-forest-green">Opening workspace canvas...</p>
        </div>
      </div>
    );
  }

  const activePages = album.pages || [];
  const currentSpreadIndex = Math.min(activeSpreadIndex, Math.max(0, Math.floor(activePages.length / 2) - 1));

  // Left page and Right page of the current spread
  const leftPage = activePages[currentSpreadIndex * 2];
  const rightPage = activePages[currentSpreadIndex * 2 + 1];

  // Helper to update pages and push history
  const updatePagesState = (newPages: BookPage[]) => {
    setSaveStatus("saving");
    const updatedAlbum = { ...album, pages: newPages };
    setAlbum(updatedAlbum);
    updateAlbum(updatedAlbum);
    
    // Add to undo/redo stack
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPages)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setTimeout(() => {
      setSaveStatus("saved");
    }, 800);
  };

  // Undo / Redo operations
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      const prevPages = JSON.parse(JSON.stringify(history[prevIndex]));
      setAlbum(prev => prev ? { ...prev, pages: prevPages } : null);
      updateAlbum({ ...album, pages: prevPages });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const nextPages = JSON.parse(JSON.stringify(history[nextIndex]));
      setAlbum(prev => prev ? { ...prev, pages: nextPages } : null);
      updateAlbum({ ...album, pages: nextPages });
    }
  };

  // Upload photo directly inside builder
  const handleBuilderPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSaveStatus("saving");
    try {
      const newAssets: PhotoAsset[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const asset = await addPhotoToIndexedDB(e.target.files[i]);
        newAssets.push(asset);
      }
      
      const updatedPhotos = [...(album.photos || []), ...newAssets];
      const updatedAlbum = { ...album, photos: updatedPhotos };
      setAlbum(updatedAlbum);
      updateAlbum(updatedAlbum);
      setSaveStatus("saved");
    } catch (err) {
      console.error(err);
      setSaveStatus("idle");
    }
  };

  // Drag-and-drop or click to place photo
  const handlePlacePhoto = (photoUrl: string) => {
    if (!selectedElement) {
      alert("Please click an image placeholder on the book pages first, then select an image from the sidebar to place it.");
      return;
    }

    const { pageId, imgIndex } = selectedElement;
    const updatedPages = activePages.map(page => {
      if (page.id === pageId) {
        const imgs = [...page.images];
        if (imgIndex !== undefined) {
          imgs[imgIndex] = photoUrl;
        } else {
          imgs[0] = photoUrl;
        }
        return { ...page, images: imgs };
      }
      return page;
    });

    updatePagesState(updatedPages);
  };

  // Change page template / layout mode
  const handleChangeLayout = (pageId: string, layoutType: BookPage["layoutType"]) => {
    const updatedPages = activePages.map(page => {
      if (page.id === pageId) {
        // Prepare empty image assets array according to type requirements
        let images: string[] = [];
        if (layoutType === "full-photo") images = [album.photos[0]?.url || ""];
        else if (layoutType === "photo-text") images = [album.photos[0]?.url || ""];
        else if (layoutType === "two-photos") images = [album.photos[0]?.url || "", album.photos[1]?.url || ""];
        else if (layoutType === "grid") images = [album.photos[0]?.url || "", album.photos[1]?.url || "", album.photos[2]?.url || ""];

        return { 
          ...page, 
          layoutType, 
          images,
          title: layoutType === "photo-text" || layoutType === "text-only" ? "A Chapter Heading" : undefined,
          text: layoutType === "photo-text" || layoutType === "text-only" ? "Write about the journey here..." : undefined
        };
      }
      return page;
    });

    updatePagesState(updatedPages);
  };

  // Inline text editing updates
  const handleUpdateText = (pageId: string, field: "text" | "title", value: string) => {
    const updatedPages = activePages.map(page => {
      if (page.id === pageId) {
        return { ...page, [field]: value };
      }
      return page;
    });
    // Silent state update without saving history on every keystroke to keep it fast
    setAlbum({ ...album, pages: updatedPages });
  };

  const handleTextBlur = () => {
    // Commit pages state to history on text input blur
    if (album) {
      updateAlbum(album);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(album.pages)));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  // Auto Generate simulation
  const handleAutoGenerateSpreads = () => {
    if (album.photos.length === 0) {
      alert("Please upload some photos first to auto-generate layouts.");
      return;
    }
    
    setSaveStatus("saving");
    const generatedPages = Array.from({ length: Math.floor(album.pageCount / 2) }).flatMap((_, spreadIdx) => {
      const pIdx1 = (spreadIdx * 2) % album.photos.length;
      const pIdx2 = (spreadIdx * 2 + 1) % album.photos.length;
      
      const page1: BookPage = {
        id: `gen-p-${spreadIdx}-1`,
        pageNumber: spreadIdx * 2 + 1,
        layoutType: "photo-text",
        title: `Chapter ${spreadIdx + 1}`,
        text: `We traveled past the winding routes near ${album.destination}. The foliage was lush green, matching the forest air.`,
        images: [album.photos[pIdx1].url],
        caption: album.photos[pIdx1].name
      };

      const page2: BookPage = {
        id: `gen-p-${spreadIdx}-2`,
        pageNumber: spreadIdx * 2 + 2,
        layoutType: "full-photo",
        images: [album.photos[pIdx2].url],
        caption: album.photos[pIdx2].name
      };

      return [page1, page2];
    });

    updatePagesState(generatedPages);
    setActiveSpreadIndex(0);
    alert("AI layout mapping complete. Spreads automatically populated.");
  };

  // AI Story Assistant generating narratives
  const handleTriggerAISuggestions = () => {
    if (!leftPage) return;
    setAiGenerating(true);
    
    setTimeout(() => {
      const generatedCaptions = [
        "Mist clung to the cedar forests as the afternoon rains settled.",
        "The wind carried scents of wet bark, damp ferns, and cardamoms.",
        "Winding mountain routes that seemed to stretch into the heavens.",
        "Sunset on the highest ridges, painting the pine needles gold."
      ];
      
      const text = generatedCaptions[Math.floor(Math.random() * generatedCaptions.length)] + 
        " Every bend in the road revealed another majestic valley, silent under the clouds of " + 
        album.destination + ".";

      const updatedPages = activePages.map(page => {
        if (page.id === leftPage.id) {
          return { 
            ...page, 
            title: "Whispers of the Hills",
            text 
          };
        }
        return page;
      });

      updatePagesState(updatedPages);
      setAiGenerating(false);
    }, 1500);
  };

  // Navigation handlers
  const handleGoPreview = () => {
    router.push(`/albums/${album.id}/preview`);
  };

  const handleGoCheckout = () => {
    router.push(`/checkout/${album.id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAF9F6] text-charcoal select-none">
      
      {/* 1. TOP BUILDER BAR */}
      <header className="h-14 border-b border-moss-green/10 bg-warm-white flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-1 hover:bg-forest-green/5 rounded-lg text-charcoal/60 hover:text-forest-green transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="font-serif text-sm font-bold text-forest-green leading-snug">{album.title}</h1>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-accent-sand font-bold">
                {album.plan} ({album.pageCount} Pages)
              </span>
              <span className="h-1 w-1 rounded-full bg-charcoal/30"></span>
              <span className="text-[10px] text-charcoal/40 font-mono">
                {saveStatus === "saving" ? "Saving updates..." : "All changes saved to cloud"}
              </span>
            </div>
          </div>
        </div>

        {/* Builder controls: Undo, Redo, Preview, Order */}
        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex border border-moss-green/10 rounded-lg overflow-hidden bg-white">
            <button 
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className="p-2 hover:bg-forest-green/5 text-charcoal/60 hover:text-forest-green border-r border-moss-green/5 disabled:opacity-30"
              title="Undo Change"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button 
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-2 hover:bg-forest-green/5 text-charcoal/60 hover:text-forest-green disabled:opacity-30"
              title="Redo Change"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleGoPreview}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-moss-green/20 px-4 text-xs font-semibold hover:bg-forest-green/5 text-forest-green"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Flipbook Preview</span>
          </button>

          <button
            onClick={handleGoCheckout}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-forest-green px-5 text-xs font-bold text-warm-white hover:bg-moss-green shadow-premium"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Order Album</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT SIDEBAR: ASSETS & TEMPLATES */}
        <aside className="w-80 border-r border-moss-green/10 bg-warm-white flex flex-col z-10 shrink-0">
          {/* Tabs header */}
          <div className="flex border-b border-moss-green/5 text-xs">
            <button 
              onClick={() => setActiveTab("uploads")}
              className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${
                activeTab === "uploads" ? "border-forest-green text-forest-green" : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              Uploads
            </button>
            <button 
              onClick={() => setActiveTab("templates")}
              className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${
                activeTab === "templates" ? "border-forest-green text-forest-green" : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              Layouts
            </button>
            <button 
              onClick={() => setActiveTab("backgrounds")}
              className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${
                activeTab === "backgrounds" ? "border-forest-green text-forest-green" : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              Covers
            </button>
            <button 
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors flex items-center justify-center gap-1 ${
                activeTab === "ai" ? "border-forest-green text-forest-green" : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI</span>
            </button>
          </div>

          {/* Tab contents */}
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* Tab: Uploads */}
            {activeTab === "uploads" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">Photos</h3>
                  <button 
                    onClick={() => document.getElementById("builder-file-input")?.click()}
                    className="inline-flex h-7 items-center justify-center gap-1 rounded bg-forest-green px-2.5 text-[10px] font-bold text-warm-white hover:bg-moss-green"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                  <input 
                    id="builder-file-input"
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleBuilderPhotoUpload} 
                    className="hidden" 
                  />
                </div>

                {album.photos.length === 0 ? (
                  <div className="border border-dashed border-moss-green/10 rounded-xl p-8 text-center space-y-2">
                    <Upload className="h-6 w-6 text-charcoal/30 mx-auto" />
                    <p className="text-[11px] text-charcoal/50">Drag in images or click Add to load travel memories.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {album.photos.map((photo) => (
                      <div 
                        key={photo.id} 
                        onClick={() => handlePlacePhoto(photo.url)}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-charcoal/5 shadow-sm hover:scale-102 transition-transform bg-white"
                        title="Click to place in selected placeholder"
                      >
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px] font-bold">
                          Place
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-moss-green/5 space-y-2">
                  <h4 className="text-[10px] font-bold text-charcoal/40 uppercase">Auto mapping</h4>
                  <button
                    onClick={handleAutoGenerateSpreads}
                    className="w-full h-9 rounded bg-forest-green/5 hover:bg-forest-green/10 text-forest-green text-xs font-bold flex items-center justify-center gap-1 border border-forest-green/15"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>Auto-Sequence Layout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Templates / Spreads */}
            {activeTab === "templates" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">Page Layouts</h3>
                <div className="space-y-3">
                  {[
                    { id: "full-photo", name: "Full Spread Photo", desc: "Edge-to-edge photography detail" },
                    { id: "photo-text", name: "Photo & Descriptive Text", desc: "Editorial layout with descriptions" },
                    { id: "two-photos", name: "Double Spreads", desc: "Two landscape photos side-by-side" },
                    { id: "text-only", name: "Text only / Title page", desc: "Poetic journals and quotes" }
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        if (selectedElement) {
                          handleChangeLayout(selectedElement.pageId, tpl.id as BookPage["layoutType"]);
                        } else {
                          // Apply to active left page by default
                          if (leftPage) handleChangeLayout(leftPage.id, tpl.id as BookPage["layoutType"]);
                        }
                      }}
                      className="w-full text-left p-3 rounded-lg border border-moss-green/15 hover:border-forest-green hover:bg-forest-green/5 bg-white transition-all space-y-1"
                    >
                      <h4 className="text-xs font-bold text-forest-green">{tpl.name}</h4>
                      <p className="text-[10px] text-charcoal/50">{tpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Background Colors */}
            {activeTab === "backgrounds" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50 font-sans">Cloth cover choices</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { hex: "#1F4D3A", name: "Forest Green" },
                    { hex: "#2D5A3D", name: "Deep Moss" },
                    { hex: "#D4A373", name: "Sand Gold" },
                    { hex: "#FAF9F6", name: "Warm Linen" },
                    { hex: "#3A566F", name: "Haze Ridge" },
                    { hex: "#15241A", name: "Charcoal Ink" }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        const updated = { ...album, coverColor: color.hex };
                        setAlbum(updated);
                        updateAlbum(updated);
                      }}
                      className="h-10 rounded-lg relative overflow-hidden border border-charcoal/10"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {album.coverColor === color.hex && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: AI Story Assistant */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">AI Story Assistant</h3>
                  <p className="text-[11px] text-charcoal/60 leading-relaxed">
                    Generate poetry and narratives based on your photos and destination. Select a page to write text.
                  </p>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the mood (e.g., mist, monsoon climb, early morning lakeside)..."
                    className="w-full p-3 rounded-lg border border-moss-green/10 text-xs focus:border-forest-green outline-none bg-white font-sans"
                  />

                  <button
                    onClick={handleTriggerAISuggestions}
                    disabled={aiGenerating}
                    className="w-full h-10 bg-forest-green text-warm-white text-xs font-bold rounded-lg shadow-premium hover:bg-moss-green flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <>
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Preserving Prose...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 text-accent-sand" />
                        <span>Generate Custom Journal Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Reserved space for Future Integrations (Google Photos, Drive, Cloud sync) */}
          <div className="p-4 bg-forest-green/5 border-t border-moss-green/10 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-accent-sand font-bold block">Future Integrations</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-charcoal/60 font-semibold">
              <div className="p-2 rounded border border-moss-green/5 bg-white text-center opacity-60 cursor-not-allowed">Google Photos</div>
              <div className="p-2 rounded border border-moss-green/5 bg-white text-center opacity-60 cursor-not-allowed">Cloud Sync</div>
            </div>
          </div>
        </aside>

        {/* 3. CENTER WORKSPACE CANVAS: PHOTOREALISTIC BOOK */}
        <main className="flex-1 flex flex-col justify-center items-center p-8 bg-charcoal/[0.03] overflow-y-auto relative">
          
          {/* Pages indicators */}
          <div className="mb-4 text-xs font-semibold text-charcoal/60">
            Pages {currentSpreadIndex * 2 + 1} – {currentSpreadIndex * 2 + 2} of {activePages.length}
          </div>

          {/* The Book Double Spreads */}
          <div className="w-full max-w-4xl aspect-[1.7/1] flex relative">
            
            {/* Page depth effects on the sides */}
            <div className="absolute -left-1 top-0 bottom-0 w-1.5 rounded-l page-depth-left bg-charcoal/20" />
            <div className="absolute -right-1 top-0 bottom-0 w-1.5 rounded-r page-depth-right bg-charcoal/20" />
            
            {/* LEFT PAGE */}
            {leftPage ? (
              <div 
                onClick={() => setSelectedElement({ pageId: leftPage.id, type: "text" })}
                className={`w-1/2 bg-white p-8 relative flex flex-col justify-between select-text transition-all duration-300 border-r border-charcoal/5 ${
                  selectedElement?.pageId === leftPage.id ? "ring-2 ring-forest-green ring-inset" : ""
                }`}
              >
                {/* Center Page curl shadow */}
                <div className="absolute inset-y-0 right-0 w-10 book-page-shadow-left pointer-events-none" />

                {/* Left Page content based on layout type */}
                {leftPage.layoutType === "full-photo" ? (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement({ pageId: leftPage.id, type: "image", imgIndex: 0 });
                    }}
                    className="w-full h-full relative bg-charcoal/5 rounded-md overflow-hidden flex items-center justify-center group cursor-pointer"
                  >
                    {leftPage.images[0] ? (
                      <img src={leftPage.images[0]} alt="Full page" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-charcoal/30">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-[10px] mt-1">Select Asset</span>
                      </div>
                    )}
                  </div>
                ) : leftPage.layoutType === "text-only" ? (
                  <div className="h-full flex flex-col justify-center text-center space-y-6 py-10 px-4">
                    <input
                      type="text"
                      value={leftPage.title || ""}
                      onChange={(e) => handleUpdateText(leftPage.id, "title", e.target.value)}
                      onBlur={handleTextBlur}
                      className="font-serif text-2xl font-bold text-forest-green text-center focus:outline-none border-b border-dashed border-transparent focus:border-forest-green/30"
                      placeholder="Title Heading"
                    />
                    <textarea
                      value={leftPage.text || ""}
                      onChange={(e) => handleUpdateText(leftPage.id, "text", e.target.value)}
                      onBlur={handleTextBlur}
                      className="font-serif text-sm italic text-charcoal/80 leading-relaxed text-center focus:outline-none border-b border-dashed border-transparent focus:border-forest-green/30 resize-none h-32"
                      placeholder="Poetic travel note..."
                    />
                  </div>
                ) : (
                  // Default photo-text layout
                  <div className="h-full flex flex-col justify-between">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ pageId: leftPage.id, type: "image", imgIndex: 0 });
                      }}
                      className="h-[55%] relative bg-charcoal/5 rounded-md overflow-hidden flex items-center justify-center group cursor-pointer"
                    >
                      {leftPage.images[0] ? (
                        <img src={leftPage.images[0]} alt="Spreads" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-charcoal/30">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-[10px] mt-1">Select Asset</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="h-[40%] flex flex-col justify-start space-y-2 mt-2">
                      <input
                        type="text"
                        value={leftPage.title || ""}
                        onChange={(e) => handleUpdateText(leftPage.id, "title", e.target.value)}
                        onBlur={handleTextBlur}
                        className="font-serif text-base font-bold text-forest-green focus:outline-none border-b border-dashed border-transparent focus:border-forest-green/30"
                        placeholder="Chapter Title"
                      />
                      <textarea
                        value={leftPage.text || ""}
                        onChange={(e) => handleUpdateText(leftPage.id, "text", e.target.value)}
                        onBlur={handleTextBlur}
                        className="font-serif text-[11px] text-charcoal/70 leading-relaxed focus:outline-none border-b border-dashed border-transparent focus:border-forest-green/30 resize-none h-20"
                        placeholder="Describe this moment..."
                      />
                    </div>
                  </div>
                )}
                
                {/* Page Number */}
                <div className="text-[10px] font-mono text-charcoal/30 mt-4 text-left">
                  {leftPage.pageNumber}
                </div>
              </div>
            ) : (
              <div className="w-1/2 bg-white/20 border-r border-charcoal/5 flex items-center justify-center text-xs text-charcoal/30">Cover Back</div>
            )}

            {/* SPINE CENTER SEPARATOR SHADER */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 book-spine-shadow z-10 pointer-events-none" />

            {/* RIGHT PAGE */}
            {rightPage ? (
              <div 
                onClick={() => setSelectedElement({ pageId: rightPage.id, type: "text" })}
                className={`w-1/2 bg-white p-8 relative flex flex-col justify-between select-text transition-all duration-300 ${
                  selectedElement?.pageId === rightPage.id ? "ring-2 ring-forest-green ring-inset" : ""
                }`}
              >
                {/* Center Page curl shadow */}
                <div className="absolute inset-y-0 left-0 w-10 book-page-shadow-right pointer-events-none" />

                {/* Right Page contents */}
                {rightPage.layoutType === "full-photo" ? (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement({ pageId: rightPage.id, type: "image", imgIndex: 0 });
                    }}
                    className="w-full h-full relative bg-charcoal/5 rounded-md overflow-hidden flex items-center justify-center group cursor-pointer"
                  >
                    {rightPage.images[0] ? (
                      <img src={rightPage.images[0]} alt="Full spreads" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-charcoal/30">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-[10px] mt-1">Select Asset</span>
                      </div>
                    )}
                  </div>
                ) : rightPage.layoutType === "two-photos" ? (
                  <div className="h-full flex flex-col gap-4">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ pageId: rightPage.id, type: "image", imgIndex: 0 });
                      }}
                      className="h-1/2 relative bg-charcoal/5 rounded-md overflow-hidden flex items-center justify-center group cursor-pointer"
                    >
                      {rightPage.images[0] ? (
                        <img src={rightPage.images[0]} alt="Double image 1" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-charcoal/30">
                          <ImageIcon className="h-6 w-6" />
                          <span className="text-[9px] mt-0.5">Select Asset</span>
                        </div>
                      )}
                    </div>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ pageId: rightPage.id, type: "image", imgIndex: 1 });
                      }}
                      className="h-1/2 relative bg-charcoal/5 rounded-md overflow-hidden flex items-center justify-center group cursor-pointer"
                    >
                      {rightPage.images[1] ? (
                        <img src={rightPage.images[1]} alt="Double image 2" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-charcoal/30">
                          <ImageIcon className="h-6 w-6" />
                          <span className="text-[9px] mt-0.5">Select Asset</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Default photo-text layout for right page
                  <div className="h-full flex flex-col justify-between">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ pageId: rightPage.id, type: "image", imgIndex: 0 });
                      }}
                      className="h-[55%] relative bg-charcoal/5 rounded-md overflow-hidden flex items-center justify-center group cursor-pointer"
                    >
                      {rightPage.images[0] ? (
                        <img src={rightPage.images[0]} alt="Spreads" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-charcoal/30">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-[10px] mt-1">Select Asset</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="h-[40%] flex flex-col justify-start space-y-2 mt-2">
                      <input
                        type="text"
                        value={rightPage.title || ""}
                        onChange={(e) => handleUpdateText(rightPage.id, "title", e.target.value)}
                        onBlur={handleTextBlur}
                        className="font-serif text-base font-bold text-forest-green focus:outline-none border-b border-dashed border-transparent focus:border-forest-green/30"
                        placeholder="Chapter Title"
                      />
                      <textarea
                        value={rightPage.text || ""}
                        onChange={(e) => handleUpdateText(rightPage.id, "text", e.target.value)}
                        onBlur={handleTextBlur}
                        className="font-serif text-[11px] text-charcoal/70 leading-relaxed focus:outline-none border-b border-dashed border-transparent focus:border-forest-green/30 resize-none h-20"
                        placeholder="Describe this moment..."
                      />
                    </div>
                  </div>
                )}

                {/* Page Number */}
                <div className="text-[10px] font-mono text-charcoal/30 mt-4 text-right">
                  {rightPage.pageNumber}
                </div>
              </div>
            ) : (
              <div className="w-1/2 bg-white/20 flex items-center justify-center text-xs text-charcoal/30">Cover Front</div>
            )}

          </div>

          {/* SPREAD NAVIGATORS */}
          <div className="flex items-center gap-6 mt-6">
            <button 
              disabled={activeSpreadIndex === 0}
              onClick={() => {
                setActiveSpreadIndex(p => p - 1);
                setSelectedElement(null);
              }}
              className="h-9 w-9 rounded-full border border-moss-green/20 hover:bg-white flex items-center justify-center text-forest-green disabled:opacity-30 shadow-sm"
              title="Previous Spread"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-charcoal/60">
              Spread {activeSpreadIndex + 1} of {Math.floor(activePages.length / 2)}
            </span>
            <button 
              disabled={activeSpreadIndex >= Math.floor(activePages.length / 2) - 1}
              onClick={() => {
                setActiveSpreadIndex(p => p + 1);
                setSelectedElement(null);
              }}
              className="h-9 w-9 rounded-full border border-moss-green/20 hover:bg-white flex items-center justify-center text-forest-green disabled:opacity-30 shadow-sm"
              title="Next Spread"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR: PROPERTIES PANEL */}
        <aside className="w-72 border-l border-moss-green/10 bg-warm-white flex flex-col p-4 space-y-6 z-10 shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-moss-green/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50 flex items-center gap-1.5">
              <Sliders className="h-4 w-4" />
              <span>Properties</span>
            </h3>
            <span className="text-[9px] uppercase tracking-widest text-accent-sand font-bold">In-Studio</span>
          </div>

          {selectedElement ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Properties for Image element */}
              {selectedElement.type === "image" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-forest-green">
                    <Crop className="h-4 w-4" />
                    <span>Crop & Scale Photo</span>
                  </div>

                  <div className="space-y-3">
                    {/* Size scale */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-charcoal/60">
                        <span>Crop Zoom</span>
                        <span>100%</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="200" 
                        defaultValue="100" 
                        className="w-full accent-forest-green cursor-pointer h-1 bg-moss-green/15 rounded-lg appearance-none" 
                      />
                    </div>

                    {/* Spacing Offset */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-charcoal/60">
                        <span>Horiz Offset</span>
                        <span>0px</span>
                      </div>
                      <input 
                        type="range" 
                        min="-50" 
                        max="50" 
                        defaultValue="0" 
                        className="w-full accent-forest-green cursor-pointer h-1 bg-moss-green/15 rounded-lg appearance-none" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-moss-green/5 space-y-2">
                    <h4 className="text-[10px] font-bold text-charcoal/40 uppercase">Layout effects</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <button className="py-1.5 rounded border border-moss-green/10 bg-white text-center font-bold hover:bg-forest-green/5">Add Frame</button>
                      <button className="py-1.5 rounded border border-moss-green/10 bg-white text-center font-bold hover:bg-forest-green/5">Full Width</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Properties for Text elements */}
              {selectedElement.type === "text" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-forest-green">
                    <Type className="h-4 w-4" />
                    <span>Typography options</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-charcoal/60 block">Font Family</span>
                      <select className="w-full h-8 px-2 rounded border border-moss-green/10 text-xs bg-white">
                        <option>Cormorant Garamond (Editorial)</option>
                        <option>Playfair Display</option>
                        <option>Inter (Sans UI)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-charcoal/60 block">Text Alignment</span>
                      <div className="grid grid-cols-3 gap-1">
                        <button className="py-1 border border-moss-green/10 bg-white text-center text-[10px] font-bold hover:bg-forest-green/5">Left</button>
                        <button className="py-1 border border-forest-green/20 bg-forest-green/5 text-center text-[10px] font-bold">Center</button>
                        <button className="py-1 border border-moss-green/10 bg-white text-center text-[10px] font-bold hover:bg-forest-green/5">Right</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-44 border border-dashed border-moss-green/10 rounded-xl flex items-center justify-center text-center p-6 text-charcoal/40 text-[11px] leading-relaxed">
              Click on any photograph or paragraph in the double-page spreads to view editing parameters.
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
