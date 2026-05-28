import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
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
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-brand-black selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
