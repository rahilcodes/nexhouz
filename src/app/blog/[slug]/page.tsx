import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchBlogPostBySlug, fetchPublishedBlogPosts } from "@/lib/db";
import { Calendar, ArrowLeft, BookOpen, Clock, Phone, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate pages every 60 seconds

export async function generateStaticParams() {
  const posts = await fetchPublishedBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | NexHouz",
    };
  }
  return {
    title: `${post.title} | NexHouz Insight`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://nexhouz.com/blog/${post.slug}`,
      type: "article",
      images: [{ url: post.cover_image_url || "/images/hero_modernist_villa.png" }]
    }
  };
}

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPostBySlug(params.slug);
  if (!post || !post.published) {
    notFound();
  }

  // Calculate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 225); // average reading speed is 225 wpm

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col font-archivo text-[#0A0A0A]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#D31E28] transition-colors"
            >
              <ArrowLeft size={14} /> Back to publications
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
            
            {/* ─── LEFT COLUMN: ARTICLE CONTENT ─── */}
            <article className="bg-white rounded-3xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
              
              {/* Cover image */}
              <div className="relative aspect-[16/9] w-full bg-gray-100 border-b border-[#EEE9E0]">
                <img
                  src={post.cover_image_url || "/images/hero_modernist_villa.png"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Meta Info */}
              <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-[#f0ebe1]">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faf0f0] border border-[#f3c9cb] text-[#D31E28]">
                    <BookOpen size={11} /> Insight Report
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-[#D31E28]" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }) : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#D31E28]" />
                    {readTime} Min Read
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {post.title}
                </h1>
                
                <p className="text-gray-400 text-xs font-extrabold uppercase tracking-widest mt-4">
                  BY NEXHOUZ ADVISORY BOARD · AUTHORIZED FOR PUBLIC DISTRIBUTION
                </p>
              </div>

              {/* Rich Body */}
              <div className="px-6 sm:px-10 py-8 leading-relaxed">
                {renderMarkdown(post.content)}
              </div>
            </article>

            {/* ─── RIGHT COLUMN: CALL TO ACTION SIDEBAR ─── */}
            <aside className="space-y-6">
              
              {/* Advisor Card */}
              <div className="bg-[#0A0A0A] text-white rounded-3xl p-6 border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] space-y-5">
                <div className="w-12 h-12 bg-red-50 border border-brand-red/10 rounded-2xl flex items-center justify-center">
                  <Phone size={20} className="text-[#D31E28]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold uppercase tracking-wide">Developer Neutral Advisory</h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Need professional representation or neutral analysis for a property transaction in Hyderabad? Get in touch with our experts.
                  </p>
                </div>
                <div className="space-y-2.5 pt-2">
                  {["100% Verified Properties Only", "No Commission bias", "Legal & RERA compliance audits"].map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                      <Check size={13} className="text-[#D31E28]" strokeWidth={3} /> {t}
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="block text-center w-full bg-[#D31E28] hover:bg-[#b0161f] text-white text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-full transition-colors mt-4"
                >
                  Book Private Advisory
                </Link>
              </div>

              {/* Legal Notice */}
              <div className="bg-white rounded-3xl border border-[#EEE9E0] p-6 shadow-[0_1px_3px_rgba(30,25,15,0.04)] space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#D31E28]">Disclaimer & Policy</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Publications compiled by NexHouz represent neutral audit reports based on GHMC approvals and public records. Market projections are approximate and subject to local micro-market volatility.
                </p>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Zero-Dependency Markdown Renderer ───
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.JSX.Element[] = [];
  const listItems: string[] = [];

  const flushList = (keyIndex: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${keyIndex}`} className="list-disc pl-6 space-y-2 text-gray-700 my-4 text-sm sm:text-base leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      listItems.length = 0;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Headings
    if (trimmed.startsWith("# ")) {
      flushList(index);
      elements.push(
        <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-8 mb-4 tracking-tight leading-tight">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(index);
      elements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4 tracking-tight leading-tight border-b pb-2">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(index);
      elements.push(
        <h3 key={index} className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-3 tracking-tight">
          {trimmed.slice(4)}
        </h3>
      );
    }
    // Lists
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
    }
    // Empty Line
    else if (trimmed === "") {
      flushList(index);
    }
    // Paragraph
    else {
      flushList(index);
      elements.push(
        <p
          key={index}
          className="text-gray-750 my-4 text-sm sm:text-base leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }}
        />
      );
    }
  });

  flushList(lines.length);
  return elements;
}

function parseInlineMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong class='font-extrabold text-gray-900'>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Code
    .replace(/`(.*?)`/g, "<code class='bg-gray-100 px-1.5 py-0.5 rounded text-[#D31E28] font-mono text-[90%]'>$1</code>");
}
