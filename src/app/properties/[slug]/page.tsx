import { properties } from "@/data/properties";
import PropertyDetailClient from "./PropertyDetailClient";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return properties.map((prop) => ({
    slug: prop.slug,
  }));
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  return <PropertyDetailClient slug={resolvedParams.slug} />;
}
