"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types for the Design System & State Management
export interface PhotoAsset {
  id: string;
  url: string;
  name: string;
  size?: string;
}

export interface BookPage {
  id: string;
  pageNumber: number; // Left page: odd/even, layout type, etc.
  layoutType: "full-photo" | "photo-text" | "two-photos" | "text-only" | "grid";
  title?: string;
  text?: string;
  images: string[]; // urls or base64 ids
  caption?: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  destination: string;
  plan: "Starter" | "Explorer" | "Adventure";
  pageCount: number;
  price: number;
  coverColor: string; // Hex or style name
  coverTitle: string;
  coverSubtitle: string;
  coverImage?: string; // photo url
  builderType: "auto" | "manual" | "hybrid";
  photos: PhotoAsset[];
  pages: BookPage[];
  createdAt: string;
  isDemo?: boolean;
}

export interface Order {
  id: string;
  albumId: string;
  albumTitle: string;
  albumCover: string;
  plan: string;
  amount: number;
  status: "Ordered" | "Processing" | "Printing" | "Quality Check" | "Packed" | "Shipped" | "Delivered";
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingUpdates: { status: string; date: string; description: string }[];
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  albumsCreatedCount: number;
  memoriesUploadedCount: number;
  destinationsExplored: string[];
  role?: "admin" | "user";
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description: string;
  status: "Active" | "Expired";
  usage: number;
}

interface AppContextType {
  albums: Album[];
  orders: Order[];
  currentUser: UserProfile | null;
  activeAlbum: Album | null;
  loading: boolean;
  createAlbum: (albumData: Partial<Album>) => Album;
  updateAlbum: (album: Album) => void;
  deleteAlbum: (id: string) => void;
  addPhotoToIndexedDB: (file: File) => Promise<PhotoAsset>;
  getPhotosFromIndexedDB: () => Promise<PhotoAsset[]>;
  placeOrder: (albumId: string, shippingAddress: Order["shippingAddress"], couponCode?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  setActiveAlbum: (album: Album | null) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  coupons: Coupon[];
  createCoupon: (coupon: Coupon) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Unsplash premium travel assets
const DEMO_PHOTOS: PhotoAsset[] = [
  { id: "demo-1", name: "Srinagar Shikara.jpg", url: "https://images.unsplash.com/photo-1595954421288-adc3e2104005?q=80&w=800" },
  { id: "demo-2", name: "Gulmarg Pine Forests.jpg", url: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800" },
  { id: "demo-3", name: "Sonamarg Glaciers.jpg", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" },
  { id: "demo-4", name: "Pahalgam Streams.jpg", url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800" },
  { id: "demo-5", name: "Dal Lake Mists.jpg", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800" },
  { id: "demo-6", name: "Chikmagalur Coffee Estate.jpg", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800" },
  { id: "demo-7", name: "Kashmir Peaks.jpg", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" },
  { id: "demo-8", name: "Western Ghats Hills.jpg", url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800" },
];

const PREBUILT_DEMO_ALBUM: Album = {
  id: "kashmir-demo",
  title: "Whispers of Kashmir",
  description: "A breathtaking journey through silent lakes, mounded snow glaciers, and winding pine forest roads of the Himalayas.",
  destination: "Kashmir Valley",
  plan: "Explorer",
  pageCount: 36,
  price: 2499,
  coverColor: "#1F4D3A", // Forest Green
  coverTitle: "Whispers of Kashmir",
  coverSubtitle: "May 2026 Expedition",
  coverImage: "https://images.unsplash.com/photo-1595954421288-adc3e2104005?q=80&w=800",
  builderType: "hybrid",
  isDemo: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  photos: DEMO_PHOTOS,
  pages: [
    {
      id: "p1",
      pageNumber: 1,
      layoutType: "photo-text",
      title: "The Silent Valley",
      text: "We woke up to mists hanging heavy on Dal Lake. The mountains stood like silent sentinels watching over the waking city.",
      images: ["https://images.unsplash.com/photo-1595954421288-adc3e2104005?q=80&w=800"],
      caption: "Srinagar, Sunrise at Dal Lake"
    },
    {
      id: "p2",
      pageNumber: 2,
      layoutType: "full-photo",
      images: ["https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800"],
      caption: "Ancient Pine Groves on the climb to Gulmarg"
    },
    {
      id: "p3",
      pageNumber: 3,
      layoutType: "two-photos",
      title: "Glacial Trails",
      text: "Sonamarg's cold winds carried stories of winter storms. Footsteps in the glacial pack melted into streams below.",
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
        "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800"
      ],
      caption: "Left: Glacial pathway; Right: Sonamarg stream trail"
    },
    {
      id: "p4",
      pageNumber: 4,
      layoutType: "grid",
      title: "The Essence of Adventure",
      text: "Every climb yielded new panoramas, forests thick with cedar, and skies that seemed to touch the pine needles.",
      images: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"
      ],
      caption: "Moments of stillness on the trail"
    }
  ]
};

// Initial state helpers
const MOCK_ORDERS: Order[] = [
  {
    id: "MS-9402",
    albumId: "kashmir-demo",
    albumTitle: "Whispers of Kashmir",
    albumCover: "https://images.unsplash.com/photo-1595954421288-adc3e2104005?q=80&w=800",
    plan: "Explorer (36 Pages)",
    amount: 2499,
    status: "Printing",
    shippingAddress: {
      fullName: "Ananya Hegde",
      email: "ananya.hegde@gmail.com",
      phone: "+91 98765 43210",
      address: "12, Whispering Pines Road, Jayanagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560041"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    trackingUpdates: [
      { status: "Ordered", date: "June 16, 2026", description: "Your order has been received and verified." },
      { status: "Processing", date: "June 16, 2026", description: "Design layout approved for production queue." },
      { status: "Printing", date: "June 18, 2026", description: "Printed on heavy uncoated archival paper sheets." }
    ]
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: "MALNAD10", discountType: "percentage", discountValue: 10, description: "10% Off all items", status: "Active", usage: 148 },
  { code: "TREK20", discountType: "percentage", discountValue: 20, description: "20% Off (Explorer/Adventure only)", status: "Active", usage: 64 },
  { code: "FIRSTEXP", discountType: "fixed", discountValue: 500, description: "₹500 Off Starter Book", status: "Active", usage: 38 },
  { code: "OFFSEASON", discountType: "percentage", discountValue: 15, description: "15% Off all sizes", status: "Expired", usage: 92 }
];

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Initialize IndexedDB and load data
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadFromLocalStorageFallback = () => {
      const storedAlbums = localStorage.getItem("malnad_albums");
      const storedOrders = localStorage.getItem("malnad_orders");
      const storedUser = localStorage.getItem("malnad_user");
      const storedCoupons = localStorage.getItem("malnad_coupons");

      const initialAlbums = storedAlbums ? JSON.parse(storedAlbums) : [PREBUILT_DEMO_ALBUM];
      const initialOrders = storedOrders ? JSON.parse(storedOrders) : MOCK_ORDERS;
      const initialUser = storedUser ? JSON.parse(storedUser) : null;
      const initialCoupons = storedCoupons ? JSON.parse(storedCoupons) : DEFAULT_COUPONS;

      setAlbums(initialAlbums);
      setOrders(initialOrders);
      setCurrentUser(initialUser);
      setCoupons(initialCoupons);
      setLoading(false);
    };

    const request = indexedDB.open("MalnadStoriesDB", 2);

    request.onupgradeneeded = (e) => {
      const database = (e.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains("photos")) {
        database.createObjectStore("photos", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("albums")) {
        database.createObjectStore("albums", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("orders")) {
        database.createObjectStore("orders", { keyPath: "id" });
      }
    };

    request.onsuccess = (e) => {
      const database = (e.target as IDBOpenDBRequest).result;
      setDb(database);

      try {
        const tx = database.transaction(["albums", "orders"], "readonly");
        const albumsStore = tx.objectStore("albums");
        const ordersStore = tx.objectStore("orders");

        const albumsReq = albumsStore.getAll();
        const ordersReq = ordersStore.getAll();

        let loadedAlbums: Album[] = [];
        let loadedOrders: Order[] = [];

        albumsReq.onsuccess = () => {
          loadedAlbums = albumsReq.result;
        };

        ordersReq.onsuccess = () => {
          loadedOrders = ordersReq.result;
        };

        tx.oncomplete = () => {
          let migrated = false;
          if (loadedAlbums.length === 0) {
            const storedAlbums = localStorage.getItem("malnad_albums");
            loadedAlbums = storedAlbums ? JSON.parse(storedAlbums) : [PREBUILT_DEMO_ALBUM];
            migrated = true;
          }
          if (loadedOrders.length === 0) {
            const storedOrders = localStorage.getItem("malnad_orders");
            loadedOrders = storedOrders ? JSON.parse(storedOrders) : MOCK_ORDERS;
            migrated = true;
          }

          const storedUser = localStorage.getItem("malnad_user");
          const storedCoupons = localStorage.getItem("malnad_coupons");

          setAlbums(loadedAlbums);
          setOrders(loadedOrders);
          setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
          setCoupons(storedCoupons ? JSON.parse(storedCoupons) : DEFAULT_COUPONS);
          setLoading(false);

          if (migrated) {
            setTimeout(() => {
              localStorage.removeItem("malnad_albums");
              localStorage.removeItem("malnad_orders");
            }, 1000);
          }
        };

        tx.onerror = () => {
          loadFromLocalStorageFallback();
        };
      } catch (err) {
        console.error("IndexedDB store access failed, falling back to LocalStorage:", err);
        loadFromLocalStorageFallback();
      }
    };

    request.onerror = () => {
      console.error("IndexedDB failed to load");
      loadFromLocalStorageFallback();
    };
  }, []);

  // Sync albums to IndexedDB
  useEffect(() => {
    if (loading || !db) return;

    try {
      const tx = db.transaction("albums", "readwrite");
      const store = tx.objectStore("albums");
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        albums.forEach((album) => {
          store.put(album);
        });
      };
    } catch (err) {
      console.error("Failed to sync albums to IndexedDB:", err);
    }
  }, [albums, db, loading]);

  // Sync orders to IndexedDB
  useEffect(() => {
    if (loading || !db) return;

    try {
      const tx = db.transaction("orders", "readwrite");
      const store = tx.objectStore("orders");
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        orders.forEach((order) => {
          store.put(order);
        });
      };
    } catch (err) {
      console.error("Failed to sync orders to IndexedDB:", err);
    }
  }, [orders, db, loading]);

  // Sync coupons to local storage
  useEffect(() => {
    if (coupons.length > 0) {
      localStorage.setItem("malnad_coupons", JSON.stringify(coupons));
    }
  }, [coupons]);

  const createCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  // IndexedDB Operations
  const addPhotoToIndexedDB = (file: File): Promise<PhotoAsset> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("IndexedDB not initialized");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Url = reader.result as string;
        const photoId = "photo-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
        const photoAsset: PhotoAsset = {
          id: photoId,
          url: base64Url,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        };

        const tx = db.transaction("photos", "readwrite");
        const store = tx.objectStore("photos");
        const request = store.add(photoAsset);

        request.onsuccess = () => {
          // Optimistically update memory counts
          setCurrentUser(prev => {
            if (!prev) return null;
            const updated = {
              ...prev,
              memoriesUploadedCount: prev.memoriesUploadedCount + 1
            };
            localStorage.setItem("malnad_user", JSON.stringify(updated));
            return updated;
          });
          resolve(photoAsset);
        };

        request.onerror = () => {
          reject("Failed to write to database");
        };
      };

      reader.onerror = () => reject("FileReader failed");
    });
  };

  const getPhotosFromIndexedDB = (): Promise<PhotoAsset[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        resolve([]);
        return;
      }
      const tx = db.transaction("photos", "readonly");
      const store = tx.objectStore("photos");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject("Failed to read database");
      };
    });
  };

  // Album operations
  const createAlbum = (albumData: Partial<Album>): Album => {
    const prices = { Starter: 1499, Explorer: 2499, Adventure: 3499 };
    const pagesCount = { Starter: 24, Explorer: 36, Adventure: 50 };

    const newAlbum: Album = {
      id: "album-" + Date.now(),
      title: albumData.title || "Untitled Journey",
      description: albumData.description || "",
      destination: albumData.destination || "Unknown Destination",
      plan: albumData.plan || "Explorer",
      pageCount: pagesCount[albumData.plan || "Explorer"],
      price: prices[albumData.plan || "Explorer"],
      coverColor: albumData.coverColor || "#1F4D3A",
      coverTitle: albumData.title || "Untitled Journey",
      coverSubtitle: albumData.destination || "A Travel Journal",
      coverImage: albumData.coverImage || DEMO_PHOTOS[0].url,
      builderType: albumData.builderType || "manual",
      photos: albumData.photos || [],
      pages: [],
      createdAt: new Date().toISOString()
    };

    // Auto-generate layouts if selected
    if (newAlbum.builderType === "auto" && newAlbum.photos.length > 0) {
      newAlbum.pages = newAlbum.photos.map((photo, index) => ({
        id: `p-${index}`,
        pageNumber: index + 1,
        layoutType: index % 3 === 0 ? "full-photo" : index % 3 === 1 ? "photo-text" : "two-photos",
        title: index % 3 === 1 ? `Chapter ${index + 1}` : undefined,
        text: index % 3 === 1 ? "The road bent sharply here, carrying us deeper into the mountains." : undefined,
        images: [photo.url],
        caption: photo.name
      }));
    } else {
      // Create empty placeholders matching plan length
      const placeholdersCount = Math.floor(newAlbum.pageCount / 2); // pairs of pages
      newAlbum.pages = Array.from({ length: placeholdersCount }).map((_, idx) => ({
        id: `p-${idx}`,
        pageNumber: idx + 1,
        layoutType: "photo-text",
        images: [],
        text: "Add some story here..."
      }));
    }

    setAlbums(prev => [newAlbum, ...prev]);
    setActiveAlbum(newAlbum);
    
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        albumsCreatedCount: prev.albumsCreatedCount + 1,
        destinationsExplored: prev.destinationsExplored.includes(newAlbum.destination)
          ? prev.destinationsExplored
          : [...prev.destinationsExplored, newAlbum.destination]
      };
      localStorage.setItem("malnad_user", JSON.stringify(updated));
      return updated;
    });

    return newAlbum;
  };

  const updateAlbum = (updatedAlbum: Album) => {
    setAlbums(prev => prev.map(a => a.id === updatedAlbum.id ? updatedAlbum : a));
    if (activeAlbum?.id === updatedAlbum.id) {
      setActiveAlbum(updatedAlbum);
    }
  };

  const deleteAlbum = (id: string) => {
    setAlbums(prev => prev.filter(a => a.id !== id));
    if (activeAlbum?.id === id) {
      setActiveAlbum(null);
    }
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        albumsCreatedCount: Math.max(0, prev.albumsCreatedCount - 1)
      };
      localStorage.setItem("malnad_user", JSON.stringify(updated));
      return updated;
    });
  };

  // Order operations
  const placeOrder = (albumId: string, shippingAddress: Order["shippingAddress"], couponCode?: string): Order => {
    const album = albums.find(a => a.id === albumId) || PREBUILT_DEMO_ALBUM;
    
    let discountAmount = 0;
    if (couponCode) {
      const activeCoupon = coupons.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.status === "Active"
      );
      if (activeCoupon) {
        if (activeCoupon.discountType === "percentage") {
          discountAmount = Math.round((album.price * activeCoupon.discountValue) / 100);
        } else {
          discountAmount = activeCoupon.discountValue;
        }
      }
    }
    const finalAmount = Math.max(0, album.price - discountAmount);

    const newOrder: Order = {
      id: "MS-" + Math.floor(1000 + Math.random() * 9000),
      albumId,
      albumTitle: album.title,
      albumCover: album.coverImage || DEMO_PHOTOS[0].url,
      plan: `${album.plan} (${album.pageCount} Pages)`,
      amount: finalAmount,
      status: "Ordered",
      shippingAddress,
      createdAt: new Date().toISOString(),
      trackingUpdates: [
        { status: "Ordered", date: new Date().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }), description: "Your order has been received and verified." }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const statusDescriptions = {
      Ordered: "Your order has been received and verified.",
      Processing: "Design layout approved for production queue.",
      Printing: "Printed on heavy uncoated archival paper sheets.",
      "Quality Check": "Inspected by hand for cover alignment and binding.",
      Packed: "Wrapped in premium protective cloth casing.",
      Shipped: "Dispatched from our Malnad studio. In transit.",
      Delivered: "Hand-delivered to your door. Welcome to the legacy."
    };

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const alreadyUpdated = o.trackingUpdates.some(u => u.status === status);
          const updates = alreadyUpdated
            ? o.trackingUpdates
            : [
                ...o.trackingUpdates,
                {
                  status,
                  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                  description: statusDescriptions[status]
                }
              ];
          return { ...o, status, trackingUpdates: updates };
        }
        return o;
      })
    );
  };

  const login = (name: string, email: string) => {
    const isAdmin = email.toLowerCase() === "admin@malnadstories.com";
    const user: UserProfile = {
      name: isAdmin ? "Admin User" : (name || "Vikram Dev"),
      email: email || (isAdmin ? "admin@malnadstories.com" : "vikram@malnadstories.com"),
      avatarUrl: isAdmin 
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      albumsCreatedCount: albums.length,
      memoriesUploadedCount: 48,
      destinationsExplored: ["Kashmir", "Chikmagalur", "Coorg"],
      role: isAdmin ? "admin" : "user"
    };
    setCurrentUser(user);
    localStorage.setItem("malnad_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("malnad_user");
  };

  return (
    <AppContext.Provider
      value={{
        albums,
        orders,
        currentUser,
        activeAlbum,
        loading,
        createAlbum,
        updateAlbum,
        deleteAlbum,
        addPhotoToIndexedDB,
        getPhotosFromIndexedDB,
        placeOrder,
        updateOrderStatus,
        setActiveAlbum,
        login,
        logout,
        coupons,
        createCoupon
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
}
