import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Caveat } from "next/font/google";
import "./globals.css";
import AppContextProvider from "@/context/AppContext";

const inter = Inter({
  variable: "--font-ui-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Malnad Stories — Premium Travel Memory Platform",
  description: "Preserve your adventures in beautifully crafted hardcover storybooks. Designed with Apple-level simplicity and National Geographic aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-warm-white text-charcoal font-sans flex flex-col">
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
