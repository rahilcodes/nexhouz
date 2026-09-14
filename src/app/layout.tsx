import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NWFGSQLZ');`,
          }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JCB1CC8DBD"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JCB1CC8DBD');
            `,
          }}
        />
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1608349647497018');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body 
        className="min-h-full flex flex-col bg-white text-brand-black selection:bg-brand-red selection:text-white"
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NWFGSQLZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1608349647497018&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
