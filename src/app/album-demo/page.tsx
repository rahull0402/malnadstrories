"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function AlbumDemoPage() {
  const router = useRouter();
  const { albums, setActiveAlbum } = useApp();

  useEffect(() => {
    // Find the preloaded Kashmir expedition demo album
    const kashmirDemo = albums.find(a => a.id === "kashmir-demo");
    if (kashmirDemo) {
      setActiveAlbum(kashmirDemo);
      // Route the client directly to the flagship Flipbook Preview!
      router.replace("/albums/kashmir-demo/preview");
    } else {
      // Fallback: if not loaded, go to dashboard
      router.replace("/dashboard");
    }
  }, [albums, setActiveAlbum, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-charcoal text-warm-white">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 rounded-full border-4 border-accent-sand border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-serif">Activating pre-bound Kashmir Expedition portfolio...</p>
      </div>
    </div>
  );
}
