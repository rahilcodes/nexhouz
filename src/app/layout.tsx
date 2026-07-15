import type { Metadata, Viewport } from "next";
import { Inter, Archivo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import FloatingChat from "@/components/chat/FloatingChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Inter({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nexhouz.com"),
  title: "NexHouz | Luxury Real Estate Proptech Intelligence",
  description: "Discover globally elite properties. NexHouz is a premium real estate intelligence platform built for modern buyers, pairing modernist architectural design with sophisticated fintech analytics.",
  keywords: ["Luxury Real Estate", "PropTech", "Modernist Architecture", "Real Estate Intelligence", "Investment Properties"],
  authors: [{ name: "NexHouz Elite Group" }],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${archivo.variable} ${cormorantGaramond.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-white text-brand-black selection:bg-brand-red selection:text-white"
        suppressHydrationWarning
      >
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
