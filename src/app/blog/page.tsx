import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchPublishedBlogPosts } from "@/lib/db";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyderabad Luxury Real Estate Blog & Market Forecasts | NexHouz",
  description: "Stay ahead with developer-neutral audits, investment forecasts, architecture trends, and property growth corridors in Hyderabad's premier locations.",
  keywords: ["Hyderabad real estate blog", "Kokapet apartments investment", "luxury villas Gachibowli", "property news Hyderabad"],
  openGraph: {
    title: "Hyderabad Luxury Real Estate Blog & Market Forecasts | NexHouz",
    description: "Stay ahead with developer-neutral audits, investment forecasts, architecture trends, and property growth corridors in Hyderabad's premier locations.",
    type: "website",
    url: "https://nexhouz.com/blog",
    images: [{ url: "/images/hero_modernist_villa.png", width: 1200, height: 630 }]
  }
};

export const revalidate = 60; // Revalidate pages every 60 seconds

export default async function BlogPage() {
  const posts = await fetchPublishedBlogPosts();

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col font-archivo text-[#0A0A0A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf0f0] border border-[#f3c9cb] text-xs font-bold uppercase tracking-wider text-[#D31E28]">
              <BookOpen size={12} /> NexHouz Publications
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Real Estate Intelligence & <span className="text-[#D31E28]">Market Forecasts</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
              Developer-neutral analyses, architectural studies, and financial audits designed to protect and grow your family's sovereign physical portfolios in Hyderabad.
            </p>
          </div>

          {/* Grid Layout */}
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#EEE9E0] rounded-3xl shadow-[0_1px_3px_rgba(30,25,15,0.04)] max-w-xl mx-auto px-6">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">No articles published yet</h3>
              <p className="text-xs text-gray-450 mt-1">Our advisory board is compiling technical data-sheets. Check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_12px_30px_rgba(30,25,15,0.06)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={post.cover_image_url || "/images/hero_modernist_villa.png"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <Calendar size={12} className="text-[#D31E28]" />
                        <span>
                          {post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }) : ""}
                        </span>
                      </div>
                      
                      <h2 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#D31E28] transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#f0ebe1] flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">By NexHouz Editorial</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#D31E28] hover:text-[#b0161f] transition-colors"
                      >
                        Read Article <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
