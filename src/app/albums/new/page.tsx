"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp, PhotoAsset } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Check, 
  BookOpen, 
  Wand2, 
  Sparkles, 
  Trash2,
  AlertCircle
} from "lucide-react";

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createAlbum, addPhotoToIndexedDB } = useApp();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  
  const [selectedPlan, setSelectedPlan] = useState<"Starter" | "Explorer" | "Adventure">("Explorer");
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoAsset[]>([]);
  const [builderType, setBuilderType] = useState<"auto" | "manual" | "hybrid">("hybrid");
  
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load query params on mount
  useEffect(() => {
    const qDest = searchParams.get("destination");
    const qPlan = searchParams.get("plan");
    
    setTimeout(() => {
      if (qDest) {
        setDestination(qDest);
        setTitle(`Wanderings in ${qDest}`);
      }
      if (qPlan && (qPlan === "Starter" || qPlan === "Explorer" || qPlan === "Adventure")) {
        setSelectedPlan(qPlan as "Starter" | "Explorer" | "Adventure");
      }
    }, 0);
  }, [searchParams]);

  // Handle image upload drag & drop
  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg("");

    const newAssets: PhotoAsset[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Only image files are supported.");
        continue;
      }
      try {
        const asset = await addPhotoToIndexedDB(file);
        newAssets.push(asset);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to store some files. Browser space might be limited.");
      }
    }

    setUploadedPhotos(prev => [...prev, ...newAssets]);
    setUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handlePhotoUpload(e.dataTransfer.files);
  };

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleLaunch = () => {
    if (!title || !destination) {
      alert("Please fill in the Album Title and Destination.");
      return;
    }

    const created = createAlbum({
      title,
      description,
      destination,
      plan: selectedPlan,
      builderType,
      photos: uploadedPhotos,
      coverImage: uploadedPhotos.length > 0 ? uploadedPhotos[0].url : undefined
    });

    // Navigate straight to the Album Builder!
    router.push(`/albums/${created.id}/build`);
  };

  const plans = [
    { id: "Starter", name: "Starter (24 Pages)", desc: "Short weekend memories", price: "₹1,499" },
    { id: "Explorer", name: "Explorer (36 Pages)", desc: "Deeper journey narratives", price: "₹2,499" },
    { id: "Adventure", name: "Adventure (50 Pages)", desc: "Grand wilderness expeditions", price: "₹3,499" }
  ];

  return (
    <div className="max-w-3xl w-full mx-auto bg-white border border-moss-green/10 rounded-2xl shadow-premium p-6 sm:p-10 space-y-10 relative">
      
      {/* Step Banner indicator */}
      <div className="flex justify-between items-center pb-6 border-b border-moss-green/5">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-accent-sand font-bold">Preservation setup</span>
          <h1 className="font-serif text-2xl font-bold text-forest-green mt-1">
            {step === 1 && "1. Album Information"}
            {step === 2 && "2. Select Print Format"}
            {step === 3 && "3. Upload Travel Assets"}
            {step === 4 && "4. Select Layout Mode"}
          </h1>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "w-6 bg-forest-green" : s < step ? "w-2 bg-moss-green/45" : "w-2 bg-moss-green/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step contents */}
      <div className="min-h-[250px]">
        {/* STEP 1: GENERAL INFO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal/70" htmlFor="dest">Primary Destination</label>
                <input 
                  id="dest"
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Coorg, Kashmir, Gokarna"
                  className="w-full h-11 px-4 rounded-lg border border-moss-green/10 bg-transparent text-sm focus:border-forest-green outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal/70" htmlFor="title">Album Title</label>
                <input 
                  id="title"
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Whispers of the Coffee Hills"
                  className="w-full h-11 px-4 rounded-lg border border-moss-green/10 bg-transparent text-sm focus:border-forest-green outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/70" htmlFor="desc">Journal Description / Intro Quote</label>
              <textarea 
                id="desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short emotional note about the trip. This is printed on the introduction page..."
                className="w-full p-4 rounded-lg border border-moss-green/10 bg-transparent text-sm focus:border-forest-green outline-none font-serif italic"
              />
            </div>
          </div>
        )}

        {/* STEP 2: PLAN SELECT */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-xs text-charcoal/60">Choose a physical layout page length. Prices include high-density cloth binding.</p>
            <div className="flex flex-col gap-4">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id as "Starter" | "Explorer" | "Adventure")}
                  className={`p-5 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                    selectedPlan === p.id 
                      ? "border-forest-green bg-forest-green/5 shadow-sm" 
                      : "border-moss-green/10 hover:border-moss-green/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      selectedPlan === p.id ? "border-forest-green bg-forest-green text-warm-white" : "border-moss-green/30"
                    }`}>
                      {selectedPlan === p.id && <Check className="h-3 w-3" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-green">{p.name}</h4>
                      <p className="text-xs text-charcoal/50">{p.desc}</p>
                    </div>
                  </div>
                  <span className="text-base font-serif font-bold text-forest-green">{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PHOTO UPLOAD */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Drag Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-moss-green/20 rounded-xl p-10 text-center bg-forest-green/5 space-y-4 hover:bg-forest-green/10 hover:border-forest-green/30 transition-all cursor-pointer relative"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input 
                id="file-input"
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="hidden" 
              />
              <Upload className="h-8 w-8 text-forest-green/45 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-forest-green">Drag & Drop Travel Photos</h4>
                <p className="text-xs text-charcoal/60 mt-1">Supports high-res JPG, PNG (Saved locally inside IndexedDB)</p>
              </div>
              <button 
                type="button"
                className="h-9 px-5 bg-forest-green text-warm-white rounded-lg text-xs font-semibold"
              >
                Select Files
              </button>
            </div>

            {uploading && (
              <div className="text-xs text-forest-green animate-pulse">
                Saving high-res image buffers to browser workspace IndexedDB database...
              </div>
            )}

            {/* Photos Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-charcoal/60">{uploadedPhotos.length} photos ready</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[220px] overflow-y-auto p-1 border border-moss-green/5 rounded-xl">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-charcoal/5 border border-moss-green/5">
                      <img src={photo.url} alt="Uploaded thumbnail" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(photo.id);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: MODE SELECT */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-xs text-charcoal/60">Select how the album canvas is initially structured.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Auto mode */}
              <div
                onClick={() => setBuilderType("auto")}
                className={`p-6 rounded-xl border flex flex-col justify-between cursor-pointer transition-all text-left ${
                  builderType === "auto" ? "border-forest-green bg-forest-green/5" : "border-moss-green/10 hover:border-moss-green/20"
                }`}
              >
                <div className="space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-forest-green/5 text-forest-green flex items-center justify-center">
                    <Wand2 className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-sm font-bold text-forest-green">Auto-Generate</h4>
                  <p className="text-[11px] text-charcoal/60 leading-relaxed">
                    Instantly sequences uploaded photos chronologically and maps them to dual spreads automatically.
                  </p>
                </div>
                <span className="text-[10px] text-accent-sand font-bold uppercase mt-4 block">Simulated Layout</span>
              </div>

              {/* Hybrid mode */}
              <div
                onClick={() => setBuilderType("hybrid")}
                className={`p-6 rounded-xl border flex flex-col justify-between cursor-pointer transition-all text-left ${
                  builderType === "hybrid" ? "border-forest-green bg-forest-green/5" : "border-moss-green/10 hover:border-moss-green/20"
                }`}
              >
                <div className="space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-forest-green/5 text-forest-green flex items-center justify-center">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-sm font-bold text-forest-green">Hybrid Mode</h4>
                  <p className="text-[11px] text-charcoal/60 leading-relaxed">
                    AI designs the initial layouts, and lets you drag, drop, write, crop, and reorder pages manually afterward.
                  </p>
                </div>
                <span className="text-[10px] text-accent-sand font-bold uppercase mt-4 block">Highly Recommended</span>
              </div>

              {/* Manual mode */}
              <div
                onClick={() => setBuilderType("manual")}
                className={`p-6 rounded-xl border flex flex-col justify-between cursor-pointer transition-all text-left ${
                  builderType === "manual" ? "border-forest-green bg-forest-green/5" : "border-moss-green/10 hover:border-moss-green/20"
                }`}
              >
                <div className="space-y-3">
                  <div className="h-8 w-8 rounded-lg bg-forest-green/5 text-forest-green flex items-center justify-center">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-sm font-bold text-forest-green">Manual Canvas</h4>
                  <p className="text-[11px] text-charcoal/60 leading-relaxed">
                    Start with empty double-page templates. Drag-in photos and place custom text boxes manually.
                  </p>
                </div>
                <span className="text-[10px] text-accent-sand font-bold uppercase mt-4 block">Complete Freedom</span>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-moss-green/5">
        <button
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else router.push("/dashboard");
          }}
          className="inline-flex h-10 items-center justify-center gap-1.5 text-xs font-bold text-forest-green hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {step < 4 ? (
          <button
            onClick={() => {
              if (step === 1 && (!title || !destination)) {
                alert("Please specify Destination and Album Title.");
                return;
              }
              if (step === 3 && uploadedPhotos.length === 0) {
                if (!confirm("Proceed without uploading photos? (You can upload photos directly in the builder canvas)")) {
                  return;
                }
              }
              setStep(step + 1);
            }}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-forest-green px-5 text-xs font-semibold text-warm-white shadow-premium hover:bg-moss-green"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-forest-green px-6 text-xs font-bold text-warm-white shadow-premium hover:bg-moss-green"
          >
            <span>Launch Studio Builder</span>
            <Sparkles className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function CreateAlbumPage() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-sm text-forest-green animate-pulse">Loading creation wizard...</div>}>
          <WizardContent />
        </Suspense>
      </main>
    </div>
  );
}
