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
  title: {
    default: "NexHouz | Buy Luxury Apartments & Villas in Hyderabad | RERA Verified",
    template: "%s | NexHouz Hyderabad"
  },
  description: "NexHouz is Hyderabad's #1 developer-neutral luxury real estate advisory. Find RERA-verified 3 & 4 BHK apartments, gated community villas, and investment plots in Kokapet, Kondapur, Gachibowli & Narsingi. Zero brokerage. Expert advisory. 47-point builder audit.",
  keywords: [
    "luxury apartments Hyderabad", "buy property Hyderabad", "RERA verified flats Hyderabad",
    "Kokapet apartments", "Kondapur 3BHK", "Gachibowli villas", "luxury villas Hyderabad",
    "real estate advisor Hyderabad", "zero brokerage Hyderabad", "new launches Hyderabad 2025",
    "gated community Hyderabad", "investment property Hyderabad", "NexHouz"
  ],
  authors: [{ name: "NexHouz Advisory Board" }],
  creator: "NexHouz",
  publisher: "NexHouz Real Estate Advisory",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/logo_black_text_mainlogo.png", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nexhouz.com",
    siteName: "NexHouz",
    title: "NexHouz | Buy Luxury Apartments & Villas in Hyderabad",
    description: "Hyderabad's developer-neutral luxury real estate platform. RERA-verified properties in Kokapet, Kondapur, Gachibowli. Zero brokerage. Expert advisory.",
    images: [{ url: "/images/hero_modernist_villa.png", width: 1200, height: 630, alt: "NexHouz Hyderabad Luxury Properties" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "NexHouz | Luxury Real Estate Hyderabad",
    description: "Buy RERA-verified luxury apartments & villas in Hyderabad. Expert advisory, zero brokerage.",
    images: ["/images/hero_modernist_villa.png"]
  }
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
