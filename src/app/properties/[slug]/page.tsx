import { properties } from "@/data/properties";
import PropertyDetailClient from "./PropertyDetailClient";
import type { Metadata } from "next";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

import { createClient } from "@supabase/supabase-js";

// New slugs added via admin are rendered on-demand (server mode, not static export)
export const dynamicParams = false;

export async function generateStaticParams() {
  // Start with hardcoded static slugs
  const staticSlugs = properties.map((prop) => ({ slug: prop.slug }));

  // Also fetch slugs from Supabase for admin-added properties
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    const { data } = await supabase
      .from("properties")
      .select("slug")
      .not("slug", "is", null);

    if (data && data.length > 0) {
      const dbSlugs = data.map((p: { slug: string }) => ({ slug: p.slug }));
      // Merge, deduplicating by slug value
      const allSlugs = [...staticSlugs];
      for (const s of dbSlugs) {
        if (!allSlugs.find((x) => x.slug === s.slug)) {
          allSlugs.push(s);
        }
      }
      return allSlugs;
    }
  } catch {
    // Fall back to static only if DB is unreachable
  }

  return staticSlugs;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const property = properties.find((p) => p.slug === resolvedParams.slug);

  if (!property) {
    return {
      title: "Property Not Found | NexHouz",
      description: "The requested luxury property listing could not be found.",
    };
  }

  const cleanDescription = property.description
    ? property.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : "Discover this premium property listing in Hyderabad.";

  return {
    title: `${property.title} | ${property.location} | NexHouz`,
    description: cleanDescription,
    alternates: {
      canonical: `https://nexhouz.com/properties/${property.slug}`,
    },
    openGraph: {
      title: `${property.title} | NexHouz`,
      description: cleanDescription,
      url: `https://nexhouz.com/properties/${property.slug}`,
      type: "website",
      images: [
        {
          url: property.image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  return <PropertyDetailClient slug={resolvedParams.slug} />;
}

